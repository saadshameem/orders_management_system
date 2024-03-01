const express = require('express');
const app = express();
const mysql2 = require('mysql2')
const port = 5000;


const cors = require('cors')
const xss = require('xss-clean')

const ordersRoute = require('./routes/orders');
const authRoute = require('./routes/auth');
const sequelize = require('./db/connect');
// const authenticateUser = require('./middleware/authentication')

require('dotenv').config();



// Synchronize the model with the database
(async () => {
  try {
    await sequelize.sync();
    console.log('Models synced successfully');
  } catch (error) {
    console.error('Error syncing models:', error);
  }
})();


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

// Error Handling Middleware
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
