

// Create a connection pool

module.exports = {
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '0987poiu',
  database: 'test',
  waitForConnections: true, // Whether the pool should automatically queue connection requests if all connections are busy
  connectionLimit: 10, // Maximum number of connections in the pool
  queueLimit: 0 
};
