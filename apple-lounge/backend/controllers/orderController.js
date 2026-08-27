const pool = require('../config/db');
const { sendOrderNotification } = require('../utils/email');

const VALID_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const VALID_PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'];
const VALID_DELIVERY_METHODS = ['pickup', 'delivery'];

exports.createOrder = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { customer_name, customer_email, customer_phone, delivery_method, delivery_address, order_notes, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    if (delivery_method && !VALID_DELIVERY_METHODS.includes(delivery_method)) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: `Invalid delivery method. Must be one of: ${VALID_DELIVERY_METHODS.join(', ')}` });
    }

    let totalAmount = 0;
    const orderItems = [];
    for (const item of items) {
      const [products] = await connection.query('SELECT * FROM products WHERE id = ?', [item.product_id]);
      if (products.length === 0) {
        await connection.rollback();
        return res.status(404).json({ success: false, message: `Product ${item.product_id} not found` });
      }
      if (products[0].stock < item.quantity) {
        await connection.rollback();
        return res.status(400).json({ success: false, message: `Insufficient stock for ${products[0].name}` });
      }
      totalAmount += products[0].price * item.quantity;
      orderItems.push({
        name: products[0].name,
        quantity: item.quantity,
        color: item.color,
        price: products[0].price,
      });
    }

    const [orderResult] = await connection.query(
      `INSERT INTO orders (customer_name, customer_email, customer_phone, total_amount, delivery_method, delivery_address, order_notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [customer_name, customer_email || null, customer_phone, totalAmount, delivery_method || 'pickup', delivery_address || null, order_notes || null]
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      const [products] = await connection.query('SELECT price FROM products WHERE id = ?', [item.product_id]);
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price, color) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, products[0].price, item.color || null]
      );
      await connection.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    await connection.commit();

    sendOrderNotification(
      { id: orderId, customer_name, customer_email, customer_phone, delivery_method: delivery_method || 'pickup', delivery_address, order_notes, total_amount: totalAmount },
      orderItems
    ).catch((error) => console.error('Order email failed:', error.message));

    res.status(201).json({
      success: true,
      data: {
        id: orderId,
        customer_name,
        total_amount: totalAmount,
        status: 'pending',
        items
      }
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (req.user.role !== 'admin' && orders[0].customer_email !== req.user.email) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const [items] = await pool.query(
      `SELECT oi.*, p.name, p.model, p.storage
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );

    res.json({ success: true, data: { ...orders[0], items } });
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, payment_status } = req.body;

    const [existing] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
      }
      await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    }
    if (payment_status) {
      if (!VALID_PAYMENT_STATUSES.includes(payment_status)) {
        return res.status(400).json({ success: false, message: `Invalid payment status. Must be one of: ${VALID_PAYMENT_STATUSES.join(', ')}` });
      }
      await pool.query('UPDATE orders SET payment_status = ? WHERE id = ?', [payment_status, req.params.id]);
    }

    const [updated] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    next(error);
  }
};
