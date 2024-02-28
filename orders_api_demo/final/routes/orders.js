
const express = require('express')
const router = express.Router()

const authorizeUser = require('../middleware/authUser')
const authorizeAdmin = require('../middleware/authAdmin')

const {
  getAllOrders,
  createOrder,
  getOrder,
  updateOrder,
  deleteOrder,
  fetchOrdersByStatus,
  filterProductsByFirm,
  piechart
  
} = require('../controllers/orders')

const { register, login, logout } = require('../controllers/auth')
// const { isAdmin, isUser } = require('../middleware/role'); // Import the middleware


router.route('/').get(authorizeUser, getAllOrders).post(authorizeUser,createOrder)
router.route('/:id').get(authorizeAdmin, getOrder).patch(authorizeAdmin,  updateOrder).delete( authorizeAdmin, deleteOrder)
router.route('/status/:status').get(authorizeUser, fetchOrdersByStatus)
router.get('/filter-by-firm/:firmName',authorizeUser,  filterProductsByFirm);
router.get('/piechart/status-summary',authorizeUser, piechart)

// =============================================xxxxxxx================================
//  auth .. 
router.post('/register',authorizeAdmin, register)
router.post('/login', login)
router.post('/logout', logout)


module.exports = router
