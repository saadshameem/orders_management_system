



const express = require('express');
const router = express.Router();
const mysql2 = require('mysql2');
const auth= require('../controllers/auth');

// const nodemailer = require('nodemailer');
// const crypto = require('crypto');

const authenticateToken = require('../middleware/authentication');
const authAdmin = require('../middleware/authAdmin')
const authUser = require('../middleware/authUser')

router.post('/register',authenticateToken, authAdmin, auth.register);
router.post('/login', auth.login);
router.post('/logout', auth.logout);

// router.post('/login-with-otp', auth.loginWithOTP);
// router.post('/request-otp', auth.requestOTP);

router.post('/sendOTP', auth.sendOTP);
router.post('/verifyOTP', auth.verifyOTP);

// const connection = mysql2.createConnection({
//     host: 'localhost',
//   port: '3306',
//   user: 'root',
//   password: '0987poiu',
//   database: 'saad'
// });

// connection.connect((err) => {
//     if (err) {
//         console.error('Error connecting to database:', err);
//         return;
//     }
//     console.log('Connected to database');
// });

// function generateOTP() {
//     return Math.floor(100000 + Math.random() * 900000);
// }

// // Send OTP via email
// async function sendOTP(email, otp) {
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: '1234##qweasd'
//         }
//     });

//     const mailOptions = {
//         from: 'msaads0606@gmail.com',
//         to: email,
//         subject: 'OTP for Login',
//         text: `Your OTP for login is: ${otp}`
//     };

//     await transporter.sendMail(mailOptions);
// }

// // Dummy database to store OTPs
// function storeOTP(email, otp) {
//     const query = 'INSERT INTO otps (email, otp) VALUES (?, ?)';
//     connection.query(query, [email, otp], (error, results) => {
//         if (error) {
//             console.error('Error storing OTP:', error);
//         } else {
//             console.log('OTP stored successfully');
//         }
//     });
// }

// function getStoredOTP(email, callback) {
//     const query = 'SELECT otp, timestamp FROM otps WHERE email = ?';
//     connection.query(query, [email], (error, results) => {
//         if (error) {
//             console.error('Error retrieving OTP:', error);
//             callback(error, null);
//         } else if (results.length === 0) {
//             callback(null, null); // No OTP found for the email
//         } else {
//             const storedOTP = results[0];
//             callback(null, storedOTP);
//         }
//     });
// }

// // Endpoint to initiate login with OTP
// router.post('/loginByOtp', async (req, res) => {
//     const { email } = req.body;
//     const otp = generateOTP();

//     // Store OTP in database
//     storeOTP(email, otp);

//     try {
//         await sendOTP(email, otp);
//         res.send('OTP sent successfully');
//     } catch (error) {
//         res.status(500).json({error:error.message});
//     }
// });

// // Endpoint to verify OTP and login
// router.post('/verifyOtp', (req, res) => {
//     const { email, otp } = req.body;
//     getStoredOTP(email, (error, storedOTP) => {
//         if (error) {
//             return res.status(500).json({error: error.message});
//         }

//         if (!storedOTP || storedOTP.otp !== otp) {
//             return res.status(401).send('Invalid OTP');
//         }

//         // Check OTP expiration (e.g., 5 minutes)
//         const otpTimestamp = new Date(storedOTP.timestamp).getTime();
//         if (Date.now() - otpTimestamp > 5 * 60 * 1000) {
//             return res.status(401).send('OTP expired');
//         }

//         // Successful login
//         res.send('Login successful');
//     });
// });

module.exports = router;

