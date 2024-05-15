


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql2 = require('mysql2');
const pool = require('../db/connect');
// const postmark = require('postmark');
// const nodemailer = require('nodemailer');
// const postmarkTransport = require('nodemailer-postmark-transport');
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


// Function to hash password
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

// Function to compare password
const comparePassword = async (candidatePassword, hashedPassword) => {
    return bcrypt.compare(candidatePassword, hashedPassword);
};

// Function to generate JWT token
const generateJWT = (userId, name, role) => {
    return jwt.sign(
        { userId, name, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME }
    );
};



// Controller for user registration
exports.register = async (req, res) => {
    try {
        // Extract user details from request body
        const { id, name, email, password, role } = req.body;

        // Check if the user already exists
        const checkUserQuery = `SELECT * FROM users WHERE email = ?`;

        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Execute the query
        const [existingUsers] = await connection.query(checkUserQuery, [email]);

        // Release the connection back to the pool
        connection.release();

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Insert user into the database
        const insertUserQuery = `INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)`;

        // Get a new connection from the pool
        const newConnection = await pool.getConnection();

        // Execute the query
        const [result] = await newConnection.query(insertUserQuery, [id, name, email, hashedPassword, role]);

        // Release the connection back to the pool
        newConnection.release();

        // Generate JWT token
        const token = generateJWT(result.insertId, name, role);

        // Send response with token
        res.status(201).json({ success: true, user: { name, role }, msg: 'User created successfully', token });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: error.message });
    }
};



// Controller for user login
exports.login = async (req, res) => {
    try {
        // Extract email and password from request body
        const { email, password } = req.body;

        // Find the user by email
        const getUserQuery = `SELECT * FROM users WHERE email = ?`;

        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Execute the query
        const [results] = await connection.query(getUserQuery, [email]);

        // Release the connection back to the pool
        connection.release();

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = results[0];

        // Compare passwords
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = generateJWT(user.id, user.name, user.role);

        // Send response with token
        res.status(200).json({ success: true, user: { id: user.id, name: user.name, role: user.role }, token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: error.message });
    }
};


// Controller for user logout 
exports.logout = async (req, res) => {
    try {

        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Function to send OTP to user's email
// exports.sendOTP = async (req, res) => {
//     const { email } = req.body;
    
//     // Generate OTP
//     const otp = randomstring.generate({
//         length: 6,
//         charset: 'numeric'
//     });

//     // Send OTP to user's email
//     try {
//         // Store OTP in the database
//         const insertQuery = 'INSERT INTO otps (email, otp) VALUES (?, ?)';
//         await pool.query(insertQuery, [email, otp]);

        // const transporter = nodemailer.createTransport({
        //     // Configure your email provider here
        //     service: 'gmail',
        //     auth: {
        //         user: 'mohammadsaad0606@gmail.com', // Your email address
        //         pass: 'zuij xxpl rrod ttif' // Your email password or app-specific password
        //     }
        // });

        // const mailOptions = {
        //     from: 'mohammadsaad0606@gmail.com',
        //     to: email,
        //     subject: 'OTP for Login',
        //     text: `Your OTP for login is: ${otp}`
        // };

//         await transporter.sendMail(mailOptions);

//         res.status(200).json({ success: true, message: 'OTP sent to your email' });
//     } catch (error) {
//         console.error('Error sending OTP:', error);
//         res.status(500).json({ success: false, message: 'Failed to send OTP' });
//     }
// };


// Function to send OTP to user's email
exports.sendOTP = async (req, res) => {
    const { email } = req.body;

    try {

        const selectUserQuery = 'SELECT * FROM users WHERE email = ?';
        const [userRows] = await pool.query(selectUserQuery, [email]);

        if (userRows.length === 0) {
            // Email is not registered
            return res.status(400).json({ success: false, message: 'Email is not registered' });
        }

        // Check if a record already exists for the given email address
        const selectQuery = 'SELECT * FROM otps WHERE email = ?';
        const [rows] = await pool.query(selectQuery, [email]);

        let otp;
        // let otpTimestamp;
        if (rows.length > 0) {
            // Update the existing record with a new OTP
            otp = randomstring.generate({
                length: 6,
                charset: 'numeric'
            });
            // otpTimestamp =  new Date(rows[0].timestamp).getTime();
            const updateQuery = 'UPDATE otps SET otp = ?, timestamp = NOW() WHERE email = ?';
            await pool.query(updateQuery, [otp, email]);
        } else {
            // Generate a new OTP and insert a new record
            otp = randomstring.generate({
                length: 6,
                charset: 'numeric'
            });
            const insertQuery = 'INSERT INTO otps (email, otp, timestamp) VALUES (?, ?, ?)';
            await pool.query(insertQuery, [email, otp, timestamp]);
        }

        // Send OTP to user's email
        const transporter = nodemailer.createTransport({
            // Configure your email provider here
            service: 'gmail',
            auth: {
                user: 'mohammadsaad0606@gmail.com', // Your email address
                pass: 'zuij xxpl rrod ttif' // Your email password or app-specific password
            }
        });

        const mailOptions = {
            from: 'mohammadsaad0606@gmail.com',
            to: email,
            subject: 'OTP for Login',
            text: `Your OTP for login is: ${otp}`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: 'OTP sent to your email' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
};

// Function to verify OTP
exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Retrieve the stored OTP for the user's email from the database
        const selectQuery = 'SELECT * FROM otps WHERE email = ? ';

        // const query = 'SELECT otp, timestamp FROM otps WHERE email = ? ORDER BY timestamp DESC LIMIT 1';
        const [rows] = await pool.query(selectQuery, [email]);

        if (rows.length === 0) {
            // No OTP found for the user's email
            return res.status(400).json({ success: false, message: 'No OTP found for this email' });
        }

        const storedOTP = rows[0].otp;
        const timestamp = new Date(rows[0].timestamp).getTime();
        const currentTime = new Date().getTime();
        const timeElapsed = currentTime - timestamp;

        if (otp == storedOTP && timeElapsed <= 10 * 60 * 1000) {
            // OTP is valid
            res.status(200).json({ success: true, message: 'OTP verification successful' });
        } else {
            // OTP is invalid
            res.status(400).json({ success: false, message: 'Invalid OTP' });
        }
        
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ success: false, message: 'Failed to verify OTP' });
    }
};

// const otpGenerator = require('otp-generator');


// exports.sendOTP = (req, res) => {
//     const { email } = req.body;

//     // Generate OTP
//     const OTP = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });

//     // Send OTP to the user's email
//     sendOTPByEmail(email, OTP);

//     res.status(200).json({ message: 'OTP sent successfully' });
//   };

//   exports.verifyOTP = (req, res) => {
//     const { email, otp } = req.body;

//     // Validate OTP (You need to implement this function)
//     if (validateOTP(email, otp)) {
//       // OTP is valid, authenticate user
//       // Generate JWT token or perform any other authentication logic
//       res.status(200).json({ message: 'OTP authenticated successfully' });
//     } else {
//       // Invalid OTP
//       res.status(401).json({ error: 'Invalid OTP' });
//     }
//   };


// // Initialize Postmark client with your server token
// const client = new postmark.ServerClient('568f4281-801b-4098-baa8-09590c9afc85');

// // Generate OTP
// function generateOTP() {
//     return Math.floor(100000 + Math.random() * 900000);
// }

// // Create a Nodemailer transporter using Postmark
// const transporter = nodemailer.createTransport(
//     postmarkTransport({
//       auth: {
//         apiKey: '568f4281-801b-4098-baa8-09590c9afc85', // Your Postmark API key
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

// // Request OTP
// exports.requestOTP = (req, res) => {
//     const { email } = req.body;
//     const otp = generateOTP();
//     // Save OTP to the database (optional)
//     // Assuming you have a 'users' table with 'email' and 'otp' columns
//     pool.query('UPDATE users SET otp = ? WHERE email = ?', [otp, email], (error, results) => {
//         if (error) {
//             console.error(error);
//             return res.status(500).json({ message: 'Internal server error' });
//         }
//         sendOTP(email, otp);
//         res.status(200).json({ message: 'OTP sent to your email' });
//     });
// };

// // Login with OTP
// exports.loginWithOTP = (req, res) => {
//     const { email, otp } = req.body;
//     db.query('SELECT * FROM users WHERE email = ? AND otp = ?', [email, otp], (error, results) => {
//         if (error) {
//             console.error(error);
//             return res.status(500).json({ message: 'Internal server error' });
//         }
//         if (results.length === 0) {
//             return res.status(401).json({ message: 'Invalid OTP' });
//         }
//         const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         // Clear OTP from the database (optional)
//         db.query('UPDATE users SET otp = NULL WHERE email = ?', [email], (error, results) => {
//             if (error) {
//                 console.error(error);
//             }
//         });
//         res.status(200).json({ token });
//     });
// };

// const connection = mysql2.createConnection({
//     host: 'localhost',
//     port: '3306',
//     user: 'root',
//     password: '0987poiu',
//     database: 'saad'
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
//             user: 'mohammadsaad0606@gmail.com',
//             pass: 'zuij xxpl rrod ttif'
//         }
//     });

//     const mailOptions = {
//         from: 'mohammadsaad0606@gmail.com',
//         to: email,
//         subject: 'OTP for Login',
//         text: `Your OTP for login is: ${otp}`
//     };

//     await transporter.sendMail(mailOptions);
// }



// function storeOTP(email, otp) {
//     const query = 'INSERT INTO otps (email, otp) VALUES (?, ?) ON DUPLICATE KEY UPDATE otp = VALUES(otp)';
//     connection.query(query, [email, otp], (error, results) => {
//         if (error) {
//             console.error('Error storing OTP:', error);
//         } else {
//             console.log('OTP stored successfully');
//         }
//     });
// }

// const getStoredOTP = async (email)=> {
//     // const query = 'SELECT otp, timestamp FROM otps WHERE email = ?';
//     try{
//     const query = 'SELECT otp, timestamp FROM otps WHERE email = ? ORDER BY timestamp DESC LIMIT 1';
//     return  connection.query(query, [email])

// }catch(error){
//     console.log(error)
// }
//         // (error, results) => {
//         // if (error) {
//         //     console.error('Error retrieving OTP:', error);
//         //     callback(error, null);
//         // } else if (results.length === 0) {
//         //     callback(null, null); // No OTP found for the email
//         // } else {
//         //     const storedOTP = results[0];
//         //     callback(null, storedOTP);
//         //     // console.log(storedOTP);
//         // }
//     // });
// }

// exports.loginByOtp = async (req, res) => {
//     try {
//     const { email } = req.body;
//     const otp = generateOTP();

//     // Store OTP in database
//     storeOTP(email, otp);

    
//         await sendOTP(email, otp);
//         res.status(200).json({ message: 'OTP sent successfully' })
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.verifyOtp = async (req, res) => {
//     try {
//         const { email, otp } = req.body;
//        const storedOTP = await  getStoredOTP(email);
//         if (!storedOTP || storedOTP.otp != otp) {
//             console.log("otp : ",otp)
//             console.log("newwwwwwwwww",storedOTP)
//             return res.status(401).json({ error: 'Invalid OTP' })

//         }
//         // Check OTP expiration (e.g., 5 minutes)
//         const otpTimestamp = new Date(storedOTP.timestamp).getTime();
//         if (Date.now() - otpTimestamp > 5 * 60 * 1000) {
//             return res.status(401).json({ error: 'OTP Expired' })
//         }
//         // Successful login
//         res.status(200).json('Login successful');
//     } catch (error) {
//         console.error('Error in verifying OTP', error);
//         return res.status(500).json({ error: error.message });
//     }
// };