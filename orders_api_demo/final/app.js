const express = require('express');
const app = express();
const mysql2 = require('mysql2')
const port = 5000;
const moment = require('moment-timezone');


// Set the default time zone for your application
moment.tz.setDefault('Asia/Kolkata');

// const cors = require('cors')
// const xss = require('xss-clean')

const otpRoutes = require('./routes/otpRoutes');
const ordersRoute = require('./routes/orders');
const authRoute = require('./routes/auth');
// const sequelize = require('./db/connect');

require('dotenv').config();


// Create MySQL connection pool
const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
  connection.release();
});

// Middleware
const authenticateToken = require('./middleware/authentication');

// app.use(cors())
// app.use(xss())

app.use(express.json());
app.use(express.static('./public3')); 
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/orders',authenticateToken, ordersRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/otp', otpRoutes);

// Error Handling Middleware
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
