const pool = require('../config/db');

exports.getProducts = async (req, res, next) => {
  try {
    const { model, category, featured, minPrice, maxPrice, storage, sort, search, page = 1, limit = 50 } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (model) {
      query += ' AND model = ?';
      params.push(model);
    }
    if (category) {
      query += ' AND LOWER(category) LIKE LOWER(?)';
      params.push(`%${category}%`);
    }
    if (featured === 'true') {
      query += ' AND featured = 1';
    }
    if (minPrice) {
      query += ' AND price >= ?';
      params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(parseFloat(maxPrice));
    }
    if (storage) {
      query += ' AND storage = ?';
      params.push(storage);
    }
    if (search) {
      query += ' AND (name LIKE ? OR model LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    switch (sort) {
      case 'price_asc': query += ' ORDER BY price ASC'; break;
      case 'price_desc': query += ' ORDER BY price DESC'; break;
      case 'newest': query += ' ORDER BY created_at DESC'; break;
      case 'popular': query += ' ORDER BY stock DESC'; break;
      default: query += ' ORDER BY featured DESC, created_at DESC';
    }

    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const [countResult] = await pool.query(countQuery, params);
    const total = countResult[0].total;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [products] = await pool.query(query, params);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: products[0] });
  } catch (error) {
    next(error);
  }
};

exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const [products] = await pool.query('SELECT * FROM products WHERE featured = 1 ORDER BY created_at DESC');
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

exports.getProductsByCategory = async (req, res, next) => {
  try {
    const [products] = await pool.query(
      'SELECT * FROM products WHERE category = ? ORDER BY featured DESC, price ASC',
      [req.params.category]
    );
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

exports.getModels = async (req, res, next) => {
  try {
    const [models] = await pool.query(
      'SELECT DISTINCT model, category FROM products ORDER BY model'
    );
    res.json({ success: true, data: models });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, model, storage, price, description, category, image, stock, featured, colors } = req.body;

    const [result] = await pool.query(
      'INSERT INTO products (name, model, storage, price, description, category, image, stock, featured, colors) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, model, storage, price, description, category || 'iphones', image || null, stock || 0, featured || false, colors || 'Black,Silver']
    );

    const [newProduct] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId]);

    res.status(201).json({ success: true, data: newProduct[0] });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { name, model, storage, price, description, category, image, stock, featured, colors } = req.body;

    const [existing] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await pool.query(
      'UPDATE products SET name=?, model=?, storage=?, price=?, description=?, category=?, image=?, stock=?, featured=?, colors=? WHERE id=?',
      [
        name || existing[0].name,
        model || existing[0].model,
        storage !== undefined ? storage : existing[0].storage,
        price || existing[0].price,
        description !== undefined ? description : existing[0].description,
        category || existing[0].category,
        image !== undefined ? image : existing[0].image,
        stock !== undefined ? stock : existing[0].stock,
        featured !== undefined ? featured : existing[0].featured,
        colors || existing[0].colors,
        req.params.id
      ]
    );

    const [updated] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const [existing] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};
