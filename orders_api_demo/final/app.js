
const express = require('express');
const app = express();

const orders = require('./routes/orders');
const auth = require('./routes/auth');
const connectDB = require('./db/connect');

require('express-async-errors');
require('dotenv').config();

//extra security packages
// const helmet = require('helmet')
// const cors = require('cors')
// const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')


// middleware
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authenticateUser  =require('./middleware/authentication')

app.set('trust proxy', 1)
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, //15 minutes
  max: 200, //limit each IP to 100 requests per windowMs
}))

// app.use(helmet())
// app.use(cors())
// app.use(xss())
app.use(express.json());
app.use(express.static('./public3')); 


// routes

app.use('/api/v1/orders',authenticateUser, orders);
app.use('/api/v1/auth', auth);

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, '0.0.0.0' , () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
