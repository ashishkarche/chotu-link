const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    ca: process.env.DB_CA,   // TLS/SSL cert
  }
});

module.exports = pool;
