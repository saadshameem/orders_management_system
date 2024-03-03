

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mysql://root:0987poiu@localhost:3306/node');

module.exports = sequelize;
