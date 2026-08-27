const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const db = new Database(path.join(__dirname, '..', 'database', 'app.sqlite'));
const products = db.prepare('SELECT * FROM products ORDER BY id').all();
const users = db.prepare('SELECT * FROM users ORDER BY id').all();

const esc = (v) => {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') return String(v);
  return "'" + String(v).replace(/'/g, "''") + "'";
};

const lines = [];
lines.push('-- MySQL seed generated from SQLite data');
lines.push('SET FOREIGN_KEY_CHECKS = 0;');
lines.push('TRUNCATE TABLE order_items;');
lines.push('TRUNCATE TABLE orders;');
lines.push('TRUNCATE TABLE products;');
lines.push('SET FOREIGN_KEY_CHECKS = 1;');

for (const p of products) {
  lines.push(`INSERT INTO products (id, name, model, storage, price, description, category, image, stock, featured, colors, created_at, updated_at) VALUES (${esc(p.id)}, ${esc(p.name)}, ${esc(p.model)}, ${esc(p.storage)}, ${esc(p.price)}, ${esc(p.description)}, ${esc(p.category)}, ${esc(p.image)}, ${esc(p.stock)}, ${esc(p.featured)}, ${esc(p.colors)}, ${esc(p.created_at)}, ${esc(p.updated_at)});`);
}

if (users.length > 0) {
  lines.push('-- users (kept, merged by email)');
  for (const u of users) {
    lines.push(`INSERT INTO users (id, name, email, phone, password, role, created_at, updated_at) VALUES (${esc(u.id)}, ${esc(u.name)}, ${esc(u.email)}, ${esc(u.phone)}, ${esc(u.password)}, ${esc(u.role)}, ${esc(u.created_at)}, ${esc(u.updated_at)});`);
  }
}

const out = path.join(__dirname, '..', 'database', 'seed.mysql.sql');
fs.writeFileSync(out, lines.join('\n') + '\n');
console.log(`Wrote ${products.length} products and ${users.length} users to ${out}`);

// --- PostgreSQL seed ---
const pg = [];
pg.push('-- PostgreSQL seed generated from SQLite data');
pg.push('TRUNCATE TABLE order_items RESTART IDENTITY CASCADE;');
pg.push('TRUNCATE TABLE orders RESTART IDENTITY CASCADE;');
pg.push('TRUNCATE TABLE products RESTART IDENTITY CASCADE;');

for (const p of products) {
  pg.push(`INSERT INTO products (id, name, model, storage, price, description, category, image, stock, featured, colors, created_at, updated_at) VALUES (${esc(p.id)}, ${esc(p.name)}, ${esc(p.model)}, ${esc(p.storage)}, ${esc(p.price)}, ${esc(p.description)}, ${esc(p.category)}, ${esc(p.image)}, ${esc(p.stock)}, ${esc(p.featured)}, ${esc(p.colors)}, ${esc(p.created_at)}, ${esc(p.updated_at)});`);
}

for (const u of users) {
  pg.push(`INSERT INTO users (id, name, email, phone, password, role, created_at, updated_at) VALUES (${esc(u.id)}, ${esc(u.name)}, ${esc(u.email)}, ${esc(u.phone)}, ${esc(u.password)}, ${esc(u.role)}, ${esc(u.created_at)}, ${esc(u.updated_at)});`);
}

// Keep identity sequences in sync with the explicit ids above.
pg.push("SELECT setval('products_id_seq', (SELECT COALESCE(MAX(id), 1) FROM products));");
pg.push("SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));");
pg.push("SELECT setval('orders_id_seq', (SELECT COALESCE(MAX(id), 1) FROM orders));");
pg.push("SELECT setval('order_items_id_seq', (SELECT COALESCE(MAX(id), 1) FROM order_items));");

const pgOut = path.join(__dirname, '..', 'database', 'seed.postgres.sql');
fs.writeFileSync(pgOut, pg.join('\n') + '\n');
console.log(`Wrote PostgreSQL seed to ${pgOut}`);
