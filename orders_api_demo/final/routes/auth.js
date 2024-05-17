



const express = require('express');
const router = express.Router();
const mysql2 = require('mysql2');
const auth= require('../controllers/auth');


const authenticateToken = require('../middleware/authentication');
const authAdmin = require('../middleware/authAdmin')
const authUser = require('../middleware/authUser')

router.post('/register',authenticateToken, authAdmin, auth.register);
router.post('/login', auth.login);
router.post('/logout', auth.logout);

router.post('/sendOTP', auth.sendOTP);
router.post('/verifyOTP', auth.verifyOTP);


module.exports = router;

