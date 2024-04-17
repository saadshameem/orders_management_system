


const mysql2 = require('mysql2');

// Create a connection pool
const pool = mysql2.createPool({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '0987poiu',
  database: 'saad',
  waitForConnections: true, // Whether the pool should automatically queue connection requests if all connections are busy
  connectionLimit: 10, // Maximum number of connections in the pool
  queueLimit: 0 
});

module.exports = pool.promise();


