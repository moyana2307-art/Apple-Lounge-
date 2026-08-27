const path = require('path');

const DRIVER = (process.env.DB_DRIVER || 'sqlite').toLowerCase();

if (DRIVER === 'mysql') {
  module.exports = require('./db.mysql');
} else if (DRIVER === 'postgres' || DRIVER === 'postgresql' || DRIVER === 'pg') {
  module.exports = require('./db.postgres');
} else {
  module.exports = require('./db.sqlite');
}
