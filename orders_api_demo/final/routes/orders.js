

const express = require('express');
const router = express.Router();
const orders = require('../controllers/orders');
// const authenticateToken = require('../middleware/authentication');
const authAdmin = require('../middleware/authAdmin')
const authUser = require('../middleware/authUser')

router.get('/',  authUser, orders.getAllOrders);
router.post('/', authAdmin, orders.createOrder);
router.get('/:id', authUser, orders.getOrder);
router.patch('/:id', authAdmin, orders.updateOrder);
router.delete('/:id', authAdmin, orders.deleteOrder);
router.get('/status/:status', authUser, orders.fetchOrdersByStatus);
router.get('/filter-by-firm/:firmName', authUser, orders.filterProductsByFirm);
router.get('/piechart/status-summary', authUser, orders.piechart)
router.get('/filter/search', authUser, orders.filteredOrders)
router.get('/chart/stats', authUser, orders.getOrderStatisticsDaily)
router.get('/chart/stats/monthly', authUser, orders.getOrderStatisticsMonthly)

module.exports = router;
