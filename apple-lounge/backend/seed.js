const bcrypt = require('bcryptjs');
const pool = require('./config/db');
const fs = require('fs');
const path = require('path');

async function seed() {
  try {
    console.log('Seeding database...');

    const dbPath = path.join(__dirname, 'database', 'app.sqlite');
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log('Removed existing SQLite database');
    }

    const schema = fs.readFileSync(path.join(__dirname, 'database', 'schema.sql'), 'utf8');
    const schemaStatements = schema.split(';').filter(s => s.trim());
    for (const statement of schemaStatements) {
      if (statement.trim()) {
        await pool.query(statement);
      }
    }
    console.log('Schema created successfully');

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
