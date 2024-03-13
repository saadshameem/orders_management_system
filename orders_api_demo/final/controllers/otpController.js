// // otpController.js

// const otpModel = require('../models/otpModel');
// const nodemailer = require('nodemailer');
// const postmarkTransport = require('nodemailer-postmark-transport');

// // Create a Nodemailer transporter using Postmark
// const transporter = nodemailer.createTransport(
//     postmarkTransport({
//       auth: {
//         apiKey: '', // Your Postmark API key
//       },
//     })
//   );
  
//   function sendOTP(email, otp) {
//     const mailOptions = {
//       from: 'mohammadsaad0606@gmail.com', // Sender's email address
//       to: email, // Recipient's email address (the user's email)
//       subject: 'OTP for Sign In',
//       text: `Your OTP for sign in is: ${otp}`,
//     };
  
//     transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log('Email sent: ' + info.response);
//       }
//     });
//   }

// function requestOTP(req, res) {
//   const { email } = req.body;
//   const otp = otpModel.generateOTP();

//   otpModel.saveOTP(email, otp);
//   sendOTP(email, otp);
//   res.send('OTP sent to your email');
// }

// function verifyOTP(req, res) {
//   const { email, otp } = req.body;

//   otpModel.verifyOTP(email, otp, (isValid) => {
//     if (isValid) {
//       res.send('OTP verified, proceed with sign in');
//     } else {
//       res.status(400).send('Invalid OTP or OTP expired');
//     }
//   });
// }

// module.exports = {
//   requestOTP,
//   verifyOTP,
// };
