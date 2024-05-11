

// const mysql2 = require('mysql2/promise');
// const jwt = require('jsonwebtoken');
// const { UnauthenticatedError } = require('../errors');
// const dbConfig = require('../db/config'); // Import database connection configuration

// const auth = async (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         console.error('No JWT token found in request headers');
//         throw new UnauthenticatedError('Authentication Invalid');
//     }

//     const token = authHeader.split(' ')[1];

//     try {
//         // Verify JWT token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log('Decoded JWT token:', decoded);

//         // Create MySQL connection pool using database configuration
//         const pool = mysql2.createPool(dbConfig);

//         // Query the database to retrieve user information based on decoded userId
//         const connection = await pool.getConnection();
//         const [rows] = await connection.execute('SELECT id, name, role FROM users WHERE id = ?', [decoded.userId]);
//         connection.release(); // Release connection back to the pool

//         if (!rows || rows.length === 0) {
//             console.error('User not found in database');
//             throw new UnauthenticatedError('User not found');
//         }

//         const user = rows[0];

//         // Attach user information to request object
//         req.user = {
//             userId: user.id,
//             name: user.name,
//             role: user.role
//         };

//         next();
//     } catch (error) {
//         console.error('Authentication error:', error);
//         throw new UnauthenticatedError('Authentication Invalid');
//     }
// };

// module.exports = auth;


const mysql2 = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');
const dbConfig = require('../db/config'); // Import database connection configuration

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error('No JWT token found in request headers');
        throw new UnauthenticatedError('Authentication Invalid');
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded JWT token:', decoded);

        // Create MySQL connection pool using database configuration
        const pool = mysql2.createPool(dbConfig);

        // Try to acquire a connection from the pool
        let connection;
        try {
            connection = await pool.getConnection();
            // Query the database to retrieve user information based on decoded userId
            const [rows] = await connection.execute('SELECT id, name, role FROM users WHERE id = ?', [decoded.userId]);

            if (!rows || rows.length === 0) {
                console.error('User not found in database');
                throw new UnauthenticatedError('User not found');
            }

            const user = rows[0];

            // Attach user information to request object
            req.user = {
                userId: user.id,
                name: user.name,
                role: user.role
            };

            next();
        } finally {
            // Release connection back to the pool
            if (connection) connection.release();
        }
    } catch (error) {
        console.error('Authentication error:', error);
        // Respond with a user-friendly error message
        res.status(401).json({ error: 'Authentication Invalid' });
    }
};

module.exports = auth;
