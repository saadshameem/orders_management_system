const express = require('express')
const router = express.Router()

const authenticateUser = require('../middleware/authentication')
const authorizeUser = require('../middleware/authUser')
const authorizeAdmin = require('../middleware/authAdmin')


const { register, login, logout } = require('../controllers/auth')

// router.post('/register',authorizeAdmin, register)
// router.post('/login', login)
// router.post('/logout', logout)

router.route('/register').post(authenticateUser, authorizeAdmin, register)
router.route('/login').post(login)
router.route('/logout').post(logout)




module.exports = router