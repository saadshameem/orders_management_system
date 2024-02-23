
const express = require('express')
const router = express.Router()

const {
  getAllOrders,
  createOrder,
  getOrder,
  updateOrder,
  deleteOrder,
  fetchOrdersByStatus
} = require('../controllers/orders')

const { register, login, logout } = require('../controllers/auth')


router.route('/').get(getAllOrders).post(createOrder)
router.route('/:id').get(getOrder).patch(updateOrder).delete(deleteOrder)
router.route('/status/:status').get(fetchOrdersByStatus)
// router.route('/:id/priority').patch(updatePriority)

// =============================================xxxxxxx================================
//  auth .. 
router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)


module.exports = router
