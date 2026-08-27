const { Pool, Client } = require('pg');

const connectionString = process.env.DATABASE_URL || process.env.PGURL || undefined;

const pool = connectionString
  ? new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      ssl: process.env.PGSSLMODE === 'require' || (connectionString && !connectionString.includes('localhost'))
        ? { rejectUnauthorized: false }
        : undefined,
    })
  : new Pool({
      host: process.env.PGHOST || process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.PGPORT || process.env.DB_PORT || '5432', 10),
      user: process.env.PGUSER || process.env.DB_USER || 'postgres',
      password: process.env.PGPASSWORD || process.env.DB_PASSWORD || '',
      database: process.env.PGDATABASE || process.env.DB_NAME || 'apple_lounge',
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      ssl: process.env.PGSSLMODE ? { rejectUnauthorized: false } : undefined,
    });

// Convert SQLite/MySQL-style `?` placeholders to Postgres `$1..$n`,
// skipping `?` that appear inside single-quoted string literals.
function convertPlaceholders(sql) {
  let out = '';
  let i = 0;
  let n = 0;
  while (i < sql.length) {
    const ch = sql[i];
    if (ch === "'") {
      out += ch;
      i++;
      while (i < sql.length) {
        if (sql[i] === "'") {
          if (sql[i + 1] === "'") {
            out += "''";
            i += 2;
            continue;
          }
          out += "'";
          i++;
          break;
        }
        out += sql[i];
        i++;
      }
      continue;
    }
    if (ch === '?') {
      n++;
      out += `$${n}`;
      i++;
      continue;
    }
    out += ch;
    i++;
  }
  return out;
}

function isInsert(sql) {
  return /^\s*insert\s+into/i.test(sql);
}

function isSingleStatement(sql) {
  const s = sql.replace(/'[^']*'/g, "''").trim();
  return !/;\s*(?!$)/.test(s);
}

// convert and run a query, returning [rows, fields] and adapting insertId
function buildPool() {
  return {
    async query(sql, params) {
      const text = convertPlaceholders(sql);
      const returning = isInsert(sql) ? ' RETURNING id' : '';
      const finalSql = isInsert(sql) && isSingleStatement(sql)
        ? text.trim().replace(/;?\s*$/, '') + returning
        : text;

      const result = await pool.query(finalSql, params || []);

      if (isInsert(sql)) {
        const row = result.rows && result.rows[0];
        return [{
          insertId: row ? row.id : result.rowCount,
          affectedRows: result.rowCount,
        }, result.fields || []];
      }
      if (/^\s*update|^\s*delete/i.test(sql)) {
        return [{ affectedRows: result.rowCount }, result.fields || []];
      }
      return [result.rows, result.fields || []];
    },

    async getConnection() {
      const client = await pool.connect();
      let inTransaction = false;
      return {
        async query(sql, params) {
          const text = convertPlaceholders(sql);
          const returning = isInsert(sql) ? ' RETURNING id' : '';
          const finalSql = isInsert(sql) && isSingleStatement(sql)
            ? text.trim().replace(/;?\s*$/, '') + returning
            : text;

          const result = await client.query(finalSql, params || []);

          if (isInsert(sql)) {
            const row = result.rows && result.rows[0];
            return [{
              insertId: row ? row.id : result.rowCount,
              affectedRows: result.rowCount,
            }, result.fields || []];
          }
          if (/^\s*update|^\s*delete/i.test(sql)) {
            return [{ affectedRows: result.rowCount }, result.fields || []];
          }
          return [result.rows, result.fields || []];
        },
        async beginTransaction() {
          await client.query('BEGIN');
          inTransaction = true;
        },
        async commit() {
          await client.query('COMMIT');
          inTransaction = false;
        },
        async rollback() {
          if (inTransaction) {
            await client.query('ROLLBACK');
            inTransaction = false;
          }
        },
        async release() {
          client.release();
        },
      };
    },
  };
}

module.exports = { ...buildPool(), _driver: 'postgres' };
