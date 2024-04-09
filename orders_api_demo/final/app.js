const express = require('express');
const app = express();
const port = 5000;
const moment = require('moment-timezone');
const path = require('path')
const cors = require('cors')
moment.tz.setDefault('Asia/Kolkata');


// const otpRoutes = require('./routes/otpRoutes');
const ordersRoute = require('./routes/orders');
const userRoutes = require('./routes/users')
const authRoute = require('./routes/auth');

// dot env.. 
require('dotenv').config();

// setup .. 
app.use(cors())
app.use(express.json({limit:'2mb'}));
app.use(express.json());
app.use(express.static('./public3'));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'public3', 'uploads')));


// Middleware
const authenticateToken = require('./middleware/authentication');



// Routes...
app.use('/api/v1/orders', authenticateToken, ordersRoute);
app.use('/api/v1/users', authenticateToken, userRoutes);
app.use('/api/v1/auth', authRoute);
// app.use('/api/v1/otp', otpRoutes);

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
