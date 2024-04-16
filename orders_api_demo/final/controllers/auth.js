const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../db/AuthQuery");

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
  return jwt.sign({ userId, name, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

exports.register = async (req, res) => {
  try {
    // Extract user details from request body
    const { name, email, password, role } = req.body;

    // Validate input data
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the user already exists
    const userExists = await User.checkUser(email);
    console.log(userExists);
    if (userExists[0]) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password securely
    const hashedPassword = await hashPassword(password);

    // Create new user instance
    const newUser = new User(name, email, hashedPassword, role);

    // Save user to the database
    const savedUser = await newUser.save();

    // Generate JWT token
    const token = generateJWT(savedUser.id, savedUser.name, savedUser.role);

    // Respond with success message and token
    res.status(201).json({
      success: true,
      user: { name: savedUser.name, role: savedUser.role },
      message: "User created successfully",
      token,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Check if email or password is missing
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find the user by email
    const user = await User.checkUser(email);

    console.log(user);

    // Check if user exists
    if (!user || user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract user details from the returned user object
    const { id, name, role, password: hashedPassword } = user[0];

    // Compare passwords
    const isMatch = await comparePassword(password, hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateJWT(id, name, role);

    // Send success response with user details and token
    res.status(200).json({
      success: true,
      user: { name, role },
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller for user logout
exports.logout = async (req, res) => {
  try {
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
