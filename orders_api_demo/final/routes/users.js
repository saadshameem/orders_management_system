

const express = require('express')
const router = express.Router()
const users = require('../controllers/users')

const authAdmin = require('../middleware/authAdmin')

router.get('/',  authAdmin, users.getAllUsers);

module.exports = router;