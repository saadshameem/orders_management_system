



const express = require('express');
const router = express.Router();
const auth= require('../controllers/auth');

const authenticateToken = require('../middleware/authentication');
const authAdmin = require('../middleware/authAdmin')
const authUser = require('../middleware/authUser')

router.post('/register',authenticateToken, authAdmin, auth.register);
router.post('/login', auth.login);
// router.post('/login-otp', auth.loginOTP); // New route for OTP login

router.post('/logout', auth.logout);


module.exports = router;

