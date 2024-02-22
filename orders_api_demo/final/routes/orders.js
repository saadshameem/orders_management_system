
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

router.route('/').get(getAllOrders).post(createOrder)
router.route('/:id').get(getOrder).patch(updateOrder).delete(deleteOrder)
router.route('/status/:status').get(fetchOrdersByStatus)
// router.route('/:id/priority').patch(updatePriority)


module.exports = router
