


const mysql2 = require('mysql2');

// Create a connection pool
const pool = mysql2.createPool({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '0987poiu',
  database: 'test'
});

module.exports = pool;
