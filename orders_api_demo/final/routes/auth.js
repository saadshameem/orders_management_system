// const express = require('express')
// const router = express.Router()
// const pool = require('../db/connect')


// const { register, login, logout } = require('../controllers/auth')

// // router.post('/register',authorizeAdmin, register)
// // router.post('/login', login)
// // router.post('/logout', logout)

// router.route('/register').post(authenticateUser, authorizeAdmin, register)
// router.route('/login').post(login)
// router.route('/logout').post(logout)




// module.exports = router



const express = require('express');
const router = express.Router();
const auth= require('../controllers/auth');

const authenticateToken = require('../middleware/authentication');
const authAdmin = require('../middleware/authAdmin')
const authUser = require('../middleware/authUser')

router.post('/register',authenticateToken, authAdmin, auth.register);
router.post('/login', auth.login);
router.post('/logout', auth.logout);

module.exports = router;
