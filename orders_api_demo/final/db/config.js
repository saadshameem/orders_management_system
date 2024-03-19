

// Create a connection pool

module.exports = {
  host: "172.26.0.15",
  user: "staging_user",
  password: "Db@user2024",
  database: "developer_db",
  waitForConnections: true, // Whether the pool should automatically queue connection requests if all connections are busy
  connectionLimit: 10, // Maximum number of connections in the pool
  queueLimit: 0 
};
