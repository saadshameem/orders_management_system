



const express = require('express');
const router = express.Router();
const auth= require('../controllers/auth');

const authenticateToken = require('../middleware/authentication');
const authAdmin = require('../middleware/authAdmin')
const authUser = require('../middleware/authUser')

router.post('/register',authenticateToken, authAdmin, auth.register);
router.post('/login', auth.login);
router.post('/logout', auth.logout);

// router.get('/admin-home', authenticateToken, authAdmin, auth.adminHomePage);
// router.get('/user-home', authenticateToken, authUser, auth.userHomePage);

module.exports = router;

