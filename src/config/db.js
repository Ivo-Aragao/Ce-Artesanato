const { Pool } = require('pg');

module.exports = new Pool({
  user: 'postgres',
  password: 'Senhordosaneis#1',
  host: 'localhost',
  port: 5432,
  database: 'launchstore'
});
