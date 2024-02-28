
const User = require('../models/User');
const asyncWrapper = require('../middleware/async')
const { createCustomError } = require('../errors/custom-error')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = asyncWrapper(async (req, res, next) => {
  try {
    // console.log("body:",req.body)
    // let role = 'user'; // Default role
    // Check if the email domain belongs to admins
    // if (req.body.email.endsWith('@admin.com')) {
    //   role = 'admin';
    // }
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can register new users' });
  }
    const user = await User.create({ ...req.body });
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({ success: true, user: { name: user.name, role: user.role }, msg: 'User created successfully', token });
  } catch (error) {
    // Ensure you are sending the error message in the response
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
})

const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials')
  }

  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials')
  }

  const token = user.createJWT()
  res.status(200).json({ success: true, user: { name: user.name, role: user.role }, token })
})

const logout = async (req, res) => {
  try {

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  register,
  login,
  logout,
}