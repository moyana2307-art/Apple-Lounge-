const pool = require('../config/db');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [productCount] = await pool.query('SELECT COUNT(*) as count FROM products');
    const [orderCount] = await pool.query('SELECT COUNT(*) as count FROM orders');
    const [pendingOrders] = await pool.query("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'");
    const [totalSales] = await pool.query("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE payment_status = 'paid'");
    const [recentOrders] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 10');
    const [categoryCounts] = await pool.query('SELECT category, COUNT(*) as count FROM products GROUP BY category');

    const [monthlySales] = await pool.query(`
      SELECT strftime('%Y-%m', created_at) as month,
             SUM(total_amount) as total,
             COUNT(*) as orders
      FROM orders
      WHERE created_at >= datetime('now', '-12 months')
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY month
    `);

    res.json({
      success: true,
      data: {
        totalProducts: productCount[0].count,
        totalOrders: orderCount[0].count,
        pendingOrders: pendingOrders[0].count,
        totalSales: totalSales[0].total,
        recentOrders,
        categoryCounts,
        monthlySales
      }
    });
  } catch (error) {
    next(error);
  }
};
