const mysql2 = require("mysql2");

// Create a connection pool
const pool = mysql2.createPool({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "MysqlPass",
  database: "saad",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise();
