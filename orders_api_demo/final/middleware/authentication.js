// const User = require('../models/User')
// const jwt = require('jsonwebtoken')
// const {UnauthenticatedError} = require('../errors')


// const auth = (req, res, next)=>{
//     const authHeader = req.headers.authorization
//     // console.log(authHeader);

//     if(!authHeader ||!authHeader.startsWith('Bearer ')){
//         throw new UnauthenticatedError('Authentication Invalid')
//     }
//     const token  = authHeader.split(' ')[1]
//     // console.log(token)

//     try {
//         const payload = jwt.verify(token, process.env.JWT_SECRET)
//         //attach the user to job routes
//         req.user= {userId:payload.userId, name:payload.name, role: payload.role}
//         // console.log(req.user);
//         next()
//     } catch (error) {
//         throw new UnauthenticatedError('Authentication Invalid')
//     }
// }

// module.exports = auth


// const jwt = require('jsonwebtoken');
// const User = require('../models/user');

// Middleware function to authenticate JWT token
// const authenticateToken = async (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//     if (token == null) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = await User.findByPk(decoded.userId);
//         next();
//     } catch (error) {
//         console.error('Error authenticating token:', error);
//         return res.status(403).json({ message: 'Forbidden' });
//     }
// };

// module.exports = authenticateToken;



const User = require('../models/User'); // Assuming your user model file is named 'user.js'
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Authentication Invalid');
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Retrieve user from MySQL based on decoded userId
        const user = await User.findByPk(decoded.userId);

        if (!user) {
            throw new UnauthenticatedError('User not found');
        }

        // Attach user information to request object
        req.user = {
            userId: user.id,
            name: user.name,
            role: user.role
        };

        next();
    } catch (error) {
        throw new UnauthenticatedError('Authentication Invalid');
    }
};

module.exports = auth;
