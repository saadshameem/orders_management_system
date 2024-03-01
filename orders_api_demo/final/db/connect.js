// const mongoose = require('mongoose')

// const connectDB = (url) => {
//   return mongoose.connect(url, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true,
//   })
// }

// module.exports = connectDB


const { Sequelize } = require('sequelize');

// Create a Sequelize instance and pass your MySQL connection parameters
const sequelize = new Sequelize('mysql://root:0987poiu@localhost:3306/node');



// Export the Sequelize instance to be used in other files
module.exports = sequelize;
