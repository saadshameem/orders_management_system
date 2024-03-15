// // otpModel.js

// const mysql2 = require('mysql2');

// const connection = mysql2.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '0987poiu',
//   database: 'node',
// });

// connection.connect();

// function generateOTP() {
//   return Math.floor(100000 + Math.random() * 900000);
// }

// function saveOTP(email, otp) {
//   const query = 'INSERT INTO otps (email, otp, expiry) VALUES (?, ?, NOW() + INTERVAL 5 MINUTE)';
//   connection.query(query, [email, otp], (error, results, fields) => {
//     if (error) throw error;
//   });
// }

// function verifyOTP(email, otp, callback) {
//   const query = 'SELECT * FROM otps WHERE email = ? AND otp = ? AND expiry > NOW()';
//   connection.query(query, [email, otp], (error, results, fields) => {
//     if (error) throw error;

//     callback(results.length > 0);
//   });
// }

// module.exports = {
//   generateOTP,
//   saveOTP,
//   verifyOTP,
// };
