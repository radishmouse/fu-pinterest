require('dotenv').config();

const pgp = require('pg-promise')({
  query: e => console.log(e.query)
});

const db = pgp({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS
});

module.exports = db;
