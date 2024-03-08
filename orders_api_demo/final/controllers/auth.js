// const User = require('../models/User');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const otpModel = require('../models/otpModel');

// // Controller for user registration
// exports.register = async (req, res) => {
//     try {
//         // Extract user details from request body
//         const { name, email, password, role } = req.body;

//         // Check if the user already exists
//         const existingUser = await User.findOne({ where: { email } });
//         if (existingUser) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create the user
//         const user = await User.create({ ...req.body });

//         // Generate JWT token
//         const token = user.createJWT();

//         // Send response with token
//         res.status(201).json({ success: true, user: { name: user.name, role: user.role }, msg: 'User created successfully', token  });
//     } catch (error) {
//         console.error('Error registering user:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// // Controller for user login
// exports.login = async (req, res) => {
//     try {
//         // Extract email and password from request body
//         const { email, password } = req.body;

//         if (!email || !password) {
//           throw new BadRequestError('Please provide email and password')
//         }

//         // Find the user by email
//         const user = await User.findOne({ where: { email } });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Compare passwords
//         const isMatch = await user.comparePassword(password);
//         if (!isMatch) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         // Generate JWT token
//         const token = user.createJWT();

//         // Send response with token
//         res.status(200).json({  success: true, user: { name: user.name, role: user.role }, token });
//     } catch (error) {
//         console.error('Error logging in user:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// // Controller for user logout (dummy implementation, as JWT tokens are stateless)
// exports.logout = async (req, res) => {
//     try {
//         // Dummy logout implementation (JWT tokens are stateless)
//         res.status(200).json({ message: 'User logged out successfully' });
//     } catch (error) {
//         console.error('Error logging out user:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };


// exports.loginOTP = async (req, res) => {
//     try {
//         const { email, otp } = req.body;

//         // Find the user by email
//         const user = await User.findOne({ where: { email } });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Verify OTP
//         otpModel.verifyOTP(email, otp, async (isValid) => {
//             if (!isValid) {
//                 return res.status(401).json({ message: 'Invalid OTP' });
//             }

//             // Generate JWT token
//             const token = user.createJWT();

//             // Send response with token
//             res.status(200).json({ success: true, user: { name: user.name, role: user.role }, token });
//         });
//     } catch (error) {
//         console.error('Error logging in user using OTP:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql2 = require('mysql2');

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
const connection = mysql2.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '0987poiu',
    database: 'test'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

// Controller for user registration
exports.register = async (req, res) => {
    try {
        // Extract user details from request body
        const { name, email, password, role } = req.body;

        // Check if the user already exists
        const checkUserQuery = `SELECT * FROM Users WHERE email = ?`;
        connection.query(checkUserQuery, [email], async (error, results) => {
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
            connection.query(insertUserQuery, [name, email, hashedPassword, role], (err, result) => {
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
        connection.query(getUserQuery, [email], async (error, results) => {
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
