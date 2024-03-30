

const isSuperAdmin = (req, res, next) => {
    // console.log('User:', req.user);
    
    if (req.user && req.user.role ==='superAdmin'){
        res.locals.isSuper = true;
        return next();
    }

    return res.status(403).json({message: 'Forbidden'});
};

module.exports = isSuperAdmin