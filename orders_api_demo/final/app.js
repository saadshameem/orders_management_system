const express = require('express');
const app = express();
const mysql2 = require('mysql2')
const port = 5000;
const moment = require('moment-timezone');
const pool = require('./db/connect');
const path = require('path')
// const bodyParser = require('body-parser');



moment.tz.setDefault('Asia/Kolkata');

// const cors = require('cors')
// const xss = require('xss-clean')

// const otpRoutes = require('./routes/otpRoutes');
const ordersRoute = require('./routes/orders');
const userRoutes = require('./routes/users')
const authRoute = require('./routes/auth');

require('dotenv').config();




// Middleware
const authenticateToken = require('./middleware/authentication');

// app.use(cors())
// app.use(xss())


// app.use(bodyParser.json());

app.use(express.json());
app.use(express.static('./public3'));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'public3', 'uploads')));



// Routes
app.use('/api/v1/orders',  ordersRoute);
app.use('/api/v1/users', authenticateToken, userRoutes);
app.use('/api/v1/auth', authRoute);
// app.use('/api/v1/otp', otpRoutes);

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
