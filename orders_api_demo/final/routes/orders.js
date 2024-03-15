

const express = require('express');
const router = express.Router();
const orders = require('../controllers/orders');
const charts = require('../controllers/charts')

const authAdmin = require('../middleware/authAdmin')
const authUser = require('../middleware/authUser')

const upload = require('../middleware/multer')
// const upload = multer({ dest: 'public3/uploads/' }); // Define upload directory


router.get('/',  authUser, orders.getAllOrders);
// router.post('/', authAdmin, orders.createOrder);
router.post('/', upload.single('image'), authAdmin, orders.createOrder); 
router.get('/newOrderDetails',authAdmin, orders.getNewOrderDetails);


router.get('/:id', authUser, orders.getOrder);
router.patch('/:id', authAdmin, orders.updateOrder);
router.delete('/:id', authAdmin, orders.deleteOrder);
router.get('/status/:status', authUser, orders.fetchOrdersByStatus);
router.get('/filter-by-firm/:firmName', authUser, orders.filterProductsByFirm);
router.get('/piechart/status-summary', authUser, charts.piechart)
router.get('/piechart/productName', authUser, charts.productPiechart)
router.get('/piechart/sales', authUser, charts.salesPiechart)
router.get('/filter/search', authUser, orders.filteredOrders)
router.get('/chart/stats', authUser, charts.getOrderStatisticsDaily)
router.get('/chart/stats/monthly', authUser, charts.getOrderStatisticsMonthly)


module.exports = router;

