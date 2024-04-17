// Import required modules
const express = require("express");
const router = express.Router();
const orders = require("../controllers/orders");
const charts = require("../controllers/charts");

const authAdmin = require("../middleware/authAdmin");
const authUser = require("../middleware/authUser");

const upload = require("../middleware/multer");
// const upload = multer({ dest: 'public3/uploads/' }); // Define upload directory

// Route to get all orders
router.get("/", authUser, orders.getAllOrders);

// Route to create a new order with image upload
router.post("/", upload.single("image"), authAdmin, orders.createOrder);

// Route to get new order details
router.get("/newOrderDetails", authAdmin, orders.getNewOrderDetails);

// Route to get order by ID
router.get("/:id", authUser, orders.getOrder);

// Route to get all product names
router.get("/products/productName", authUser, orders.getAllProducts);

// Route to add a new product
router.post("/products/productName", authUser, orders.AddNewProduct);

// Route to delete a product by name
router.delete("/products/productName/:name", authAdmin, orders.deleteProduct);

// Route to edit an order with image upload
router.patch("/:id", upload.single("image"), authAdmin, orders.editOrder);

// Route to delete an order by ID
router.delete("/:id", authAdmin, orders.deleteOrder);

// Route to fetch orders by status
router.get("/status/:status", authUser, orders.fetchOrdersByStatus);

// Route to filter products by firm name
router.get("/filter-by-firm/:firmName", authUser, orders.filterProductsByFirm);

// Route to get pie chart data for order status summary
router.get("/piechart/status-summary", authUser, charts.piechart);

// Route to get pie chart data for product name
router.get("/piechart/productName", authUser, charts.productPiechart);

// Route to get pie chart data for sales
router.get("/piechart/sales", authUser, charts.salesPiechart);

// Route to filter orders by search query
router.get("/filter/search", authUser, orders.filteredOrders);

// Route to get daily order statistics
router.get("/chart/stats", authUser, charts.getOrderStatisticsDaily);

// Route to get monthly order statistics
router.get("/chart/stats/monthly", authUser, charts.getOrderStatisticsMonthly);

module.exports = router;
