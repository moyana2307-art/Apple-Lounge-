const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'database', 'app.sqlite');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function toRows(stmt, params) {
  if (params && params.length > 0) {
    return stmt.all(...params);
  }
  return stmt.all();
}

const pool = {
  query(sql, params) {
    const d = getDb();
    const trimmed = sql.trim();

    if (trimmed.toUpperCase().startsWith('SELECT') || trimmed.toUpperCase().startsWith('PRAGMA')) {
      const stmt = d.prepare(sql);
      const rows = toRows(stmt, params);
      return Promise.resolve([rows, []]);
    }

    if (trimmed.toUpperCase().startsWith('INSERT')) {
      const info = d.prepare(sql).run(...(params || []));
      return Promise.resolve([{ insertId: info.lastInsertRowid, affectedRows: info.changes }, []]);
    }

    if (trimmed.toUpperCase().startsWith('UPDATE') || trimmed.toUpperCase().startsWith('DELETE')) {
      const info = d.prepare(sql).run(...(params || []));
      return Promise.resolve([{ affectedRows: info.changes }, []]);
    }

    d.exec(sql);
    return Promise.resolve([[], []]);
  },

  getConnection() {
    const d = getDb();
    let inTransaction = false;

    return {
      query(sql, params) {
        const trimmed = sql.trim().toUpperCase();

        if (trimmed.startsWith('SELECT')) {
          const stmt = d.prepare(sql);
          const rows = toRows(stmt, params);
          return Promise.resolve([rows, []]);
        }

        if (trimmed.startsWith('INSERT')) {
          const info = d.prepare(sql).run(...(params || []));
          return Promise.resolve([{ insertId: info.lastInsertRowid, affectedRows: info.changes }, []]);
        }

        if (trimmed.startsWith('UPDATE') || trimmed.startsWith('DELETE')) {
          const info = d.prepare(sql).run(...(params || []));
          return Promise.resolve([{ affectedRows: info.changes }, []]);
        }

        d.exec(sql);
        return Promise.resolve([[], []]);
      },

      beginTransaction() {
        d.exec('BEGIN');
        inTransaction = true;
        return Promise.resolve();
      },

      commit() {
        d.exec('COMMIT');
        inTransaction = false;
        return Promise.resolve();
      },

      rollback() {
        if (inTransaction) {
          d.exec('ROLLBACK');
          inTransaction = false;
        }
        return Promise.resolve();
      },

      release() {
        // no-op for SQLite
      }
    };
  }
};

module.exports = pool;
