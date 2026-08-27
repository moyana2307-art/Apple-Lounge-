const bcrypt = require('bcryptjs');
const pool = require('./config/db');
const fs = require('fs');
const path = require('path');

async function seed() {
  try {
    console.log('Seeding database...');

    const schema = fs.readFileSync(path.join(__dirname, 'database', 'schema.sql'), 'utf8');
    const schemaStatements = schema.split(';').filter(s => s.trim());
    for (const statement of schemaStatements) {
      if (statement.trim()) {
        await pool.query(statement);
      }
    }
    console.log('Schema created successfully');

    const driver = (process.env.DB_DRIVER || 'sqlite').toLowerCase();
    if (driver === 'sqlite') {
      const [columns] = await pool.query('PRAGMA table_info(products)');
      if (!columns.some((column) => column.name === 'price_label')) {
        await pool.query('ALTER TABLE products ADD COLUMN price_label TEXT');
      }
    } else if (driver === 'mysql') {
      try { await pool.query('ALTER TABLE products ADD COLUMN price_label VARCHAR(50)'); } catch (error) {
        if (!error.message.includes('Duplicate column')) throw error;
      }
    } else {
      await pool.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS price_label TEXT');
    }

    const [existing] = await pool.query('SELECT COUNT(*) as count FROM products');
    if (existing[0].count > 0) {
      console.log('Products already seeded. Skipping...');
    } else {
      const seed = fs.readFileSync(path.join(__dirname, 'database', 'seed.sql'), 'utf8');
      const seedStatements = seed.split(';').filter(s => s.trim());
      for (const statement of seedStatements) {
        if (statement.trim() && !statement.trim().startsWith('--')) {
          await pool.query(statement);
        }
      }
      console.log('Products seeded successfully');
    }

    const samsungProducts = [
      ['Samsung Galaxy S21 Ultra', 300, '/Pics/S21 Ultra.webp', 'A premium Galaxy flagship with a versatile camera system, vivid display, and powerful everyday performance.'],
      ['Samsung Galaxy S22', 340, '/Pics/s22.webp', 'A compact Galaxy flagship with a bright display, capable camera system, and smooth performance.'],
      ['Samsung Galaxy S22 Ultra', 390, '/Pics/s22 Ultra.webp', 'Galaxy Note-inspired flagship power with an integrated S Pen and an advanced camera experience.'],
      ['Samsung Galaxy S23', 450, '/Pics/s23.webp', 'A refined Galaxy flagship with fast performance, a crisp display, and a dependable camera system.'],
      ['Samsung Galaxy S23 Ultra', 549, '/Pics/s23 ultra.jpg', 'Ultra-level Galaxy performance with an S Pen, high-resolution camera, and expansive display.'],
      ['Samsung Galaxy S24', 620, '/Pics/s24.webp', 'A modern Galaxy flagship with intelligent features, a bright display, and all-day capability.'],
      ['Samsung Galaxy S24 Ultra', 699, '/Pics/s24 ultra.webp', 'Titanium-finished Galaxy Ultra performance with an S Pen and a pro-grade camera system.'],
      ['Samsung Galaxy S25', 720, '/Pics/s25.webp', 'The next-generation Galaxy flagship, designed for fast performance and intelligent everyday use.'],
      ['Samsung Galaxy S25 Ultra', 899, '/Pics/s25 ultra.webp', 'A premium Galaxy Ultra with exceptional performance, a versatile camera, and a spacious display.'],
      ['Samsung Galaxy S26', 950, '/Pics/s26.webp', 'The latest Galaxy flagship with advanced performance, a polished design, and a vivid display.'],
      ['Samsung Galaxy S26 Ultra', 1299, '/Pics/s26 ultra.webp', 'The ultimate Galaxy experience with flagship performance, pro-grade imaging, and an immersive display.'],
    ];

    const accessoryProducts = [
      ['Tempered Glass', 5, 'From $5', '/Pics/tempered glass.webp', 'Scratch-resistant screen protection for your device.'],
      ['Camera Lens Protector', 10, null, '/Pics/camera lens .webp', 'Protective coverage for your phone camera lenses.'],
      ['Fast Charger', 15, null, '/Pics/fast charger .webp', 'Fast, reliable charging for compatible devices.'],
      ['Samsung Cases', 5, 'From $5', '/Pics/samsung cases.webp', 'Protective cases designed for Samsung Galaxy devices.'],
      ['iPhone Cases', 5, 'From $5', '/Pics/iphone case.webp', 'Slim protective cases for iPhone models.'],
      ['Headphones', 25, null, '/Pics/headphones.webp', 'Comfortable headphones for immersive everyday listening.'],
    ];

    for (const [name, price, priceLabel, image, description] of accessoryProducts) {
      const [existing] = await pool.query('SELECT id FROM products WHERE name = ? AND category = ?', [name, 'accessories']);
      if (existing.length === 0) {
        await pool.query(
          'INSERT INTO products (name, model, storage, price, price_label, description, category, image, stock, featured, colors) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [name, name, 'N/A', price, priceLabel, description, 'accessories', image, 25, 0, 'Black,White']
        );
      }
    }
    console.log('Accessory products checked and added where missing');

    await pool.query(
      "UPDATE products SET image = ? WHERE name = '2TB iCloud Storage' AND category = 'accessories'",
      ['/Pics/2tb icloud storage.jpg']
    );

    for (const [name, price, image, description] of samsungProducts) {
      const [existing] = await pool.query('SELECT id FROM products WHERE name = ?', [name]);
      if (existing.length === 0) {
        await pool.query(
          'INSERT INTO products (name, model, storage, price, price_label, description, category, image, stock, featured, colors) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [name, name, 'N/A', price, null, description, 'samsung', image, 10, 0, 'Black,Silver,Blue']
        );
      }
    }
    console.log('Samsung products checked and added where missing');

    const [admins] = await pool.query("SELECT id FROM users WHERE email = 'admin@applelounge.co.zw'");
    if (admins.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      await pool.query(
        "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)",
        ['Admin', 'admin@applelounge.co.zw', '+263771234567', hashedPassword, 'admin']
      );
      console.log('Admin user created (admin@applelounge.co.zw / admin123)');
    }

    const [counts] = await pool.query('SELECT COUNT(*) as count FROM products');
    console.log(`Total products in database: ${counts[0].count}`);

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
