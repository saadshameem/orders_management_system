


const mysql2 = require('mysql2');

// Create a connection pool
const pool = mysql2.createPool({
  host: '172.26.0.15',
  // port: '3306',
  user: 'staging_user',
  password: 'Db@user2024',
  database: 'developer_db'
});

module.exports = pool;
