

// const { Sequelize } = require('sequelize');

// // const sequelize = new Sequelize('mysql://root:0987poiu@localhost:3306/node');

// const sequelize = new Sequelize('test', 'root', '0987poiu', {
//     host: 'localhost',
//     port: '3306',
//     dialect: 'mysql', 
    
//   });

// module.exports = sequelize;
  

// const mysql = require('mysql2');

// Create a connection pool
module.exports = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '3306',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '0987poiu',
    database: process.env.DB_DATABASE || 'test',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
  


