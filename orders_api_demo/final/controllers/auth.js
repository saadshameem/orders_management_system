const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Controller for user registration
exports.register = async (req, res) => {
    try {
        // Extract user details from request body
        const { name, email, password, role } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const user = await User.create({ ...req.body });

        // Generate JWT token
        const token = user.createJWT();

        // Send response with token
        res.status(201).json({ success: true, user: { name: user.name, role: user.role }, msg: 'User created successfully', token  });
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

        if (!email || !password) {
          throw new BadRequestError('Please provide email and password')
        }

        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = user.createJWT();

        // Send response with token
        res.status(200).json({  success: true, user: { name: user.name, role: user.role }, token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller for user logout (dummy implementation, as JWT tokens are stateless)
exports.logout = async (req, res) => {
    try {
        // Dummy logout implementation (JWT tokens are stateless)
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

