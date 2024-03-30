// const User = require('../models/User')
// const jwt = require('jsonwebtoken')

const isUser = (req, res, next) =>{
    // console.log('User:', req.user);
    if (req.user && req.user.role === 'user' || 'admin' || 'superAdmin') {
        return next();
    }
    return res.status(403).json({ message: 'Forbidden'});
};

module.exports = isUser

