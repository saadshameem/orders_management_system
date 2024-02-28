const User = require('../models/User')
const jwt = require('jsonwebtoken')

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role ==='admin'){
        return next();
    }

    return res.status(403).json({message: 'Forbidden'});
};

const isUser = (req, res, next) =>{
    if(req.user && req.user.role === 'user'){
        return next()
    }
    return res.status(403).json({ message: 'Forbidden'});
};

module.exports={
    isAdmin,
    isUser
}