const pool = require('../config/db');

function toDbDate(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
}

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [productCount] = await pool.query('SELECT COUNT(*) as count FROM products');
    const [orderCount] = await pool.query('SELECT COUNT(*) as count FROM orders');
    const [pendingOrders] = await pool.query("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'");
    const [totalSales] = await pool.query("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE payment_status = 'paid'");
    const [recentOrders] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 10');
    const [categoryCounts] = await pool.query('SELECT category, COUNT(*) as count FROM products GROUP BY category');

    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - 12);
    const driver = (process.env.DB_DRIVER || 'sqlite').toLowerCase();
    const monthExpr = driver === 'mysql'
      ? "DATE_FORMAT(created_at, '%Y-%m')"
      : driver === 'postgres' || driver === 'postgresql' || driver === 'pg'
        ? "to_char(created_at, 'YYYY-MM')"
        : "strftime('%Y-%m', created_at)";
    const cutoffParam = driver === 'postgres' || driver === 'postgresql' || driver === 'pg'
      ? cutoff.toISOString()
      : toDbDate(cutoff);

    const [monthlySales] = await pool.query(`
      SELECT ${monthExpr} as month,
             SUM(total_amount) as total,
             COUNT(*) as orders
      FROM orders
      WHERE created_at >= ?
      GROUP BY ${monthExpr}
      ORDER BY month
    `, [cutoffParam]);

    const num = (v) => (v === null || v === undefined ? 0 : Number(v));
    const safeMonthlySales = monthlySales.map((m) => ({
      ...m,
      total: num(m.total),
      orders: num(m.orders),
    }));

    res.json({
      success: true,
      data: {
        totalProducts: num(productCount[0].count),
        totalOrders: num(orderCount[0].count),
        pendingOrders: num(pendingOrders[0].count),
        totalSales: num(totalSales[0].total),
        recentOrders,
        categoryCounts: categoryCounts.map((c) => ({ ...c, count: num(c.count) })),
        monthlySales: safeMonthlySales
      }
    });
  } catch (error) {
    next(error);
  }
};
