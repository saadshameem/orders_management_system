


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql2 = require('mysql2');
const pool = require('../db/connect');


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

// Database connection configuration
// const connection = mysql2.createConnection({
//     host: 'localhost',
//     port: '3306',
//     user: 'root',
//     password: '0987poiu',
//     database: 'test'
// });

// connection.connect((err) => {
//     if (err) {
//         console.error('Error connecting to database:', err);
//         return;
//     }
//     console.log('Connected to database');
// });

// Controller for user registration
exports.register = async (req, res) => {
    try {
        // Extract user details from request body
        const { name, email, password, role } = req.body;

        // Check if the user already exists
        const checkUserQuery = `SELECT * FROM Users WHERE email = ?`;
        pool.query(checkUserQuery, [email], async (error, results) => {
            if (error) {
                console.error('Error checking user:', error);
                res.status(500).json({ message: 'Internal server error' });
                return;
            }

            if (results.length > 0) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash the password
            const hashedPassword = await hashPassword(password);

            // Insert user into the database
            const insertUserQuery = `INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)`;
            pool.query(insertUserQuery, [name, email, hashedPassword, role], (err, result) => {
                if (err) {
                    console.error('Error creating user:', err);
                    res.status(500).json({ message: 'Internal server error' });
                    return;
                }
                
                // Generate JWT token
                const token = generateJWT(result.insertId, name, role);

                // Send response with token
                res.status(201).json({ success: true, user: { name, role }, msg: 'User created successfully', token });
            });
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller for user login
exports.login = async (req, res) => {
    try {
        // Extract email and password from request body
        const { email, password } = req.body;

        // Find the user by email
        const getUserQuery = `SELECT * FROM Users WHERE email = ?`;
        pool.query(getUserQuery, [email], async (error, results) => {
            if (error) {
                console.error('Error finding user:', error);
                res.status(500).json({ message: 'Internal server error' });
                return;
            }

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
            res.status(200).json({ success: true, user: { name: user.name, role: user.role }, token });
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
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