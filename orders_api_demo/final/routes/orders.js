

const express = require('express');
const router = express.Router();
const orders = require('../controllers/orders');
const charts = require('../controllers/charts')
// const pdfkit = require('pdfkit');
// const fs = require('fs');
const pool = require('../db/connect');

const authAdmin = require('../middleware/authAdmin')
const authUser = require('../middleware/authUser')

const upload = require('../middleware/multer')
// const upload = multer({ dest: 'public3/uploads/' }); // Define upload directory


router.get('/',  authUser, orders.getAllOrders);
router.post('/', upload.single('image'), authAdmin, orders.createOrder); 



router.get('/newOrderDetails',authAdmin, orders.getNewOrderDetails);
router.get('/:id', authUser, orders.getOrder);



router.get('/products/productName', authUser, orders.getAllProducts);
router.post('/products/productName', authUser, orders.AddNewProduct);
router.delete('/products/productName/:name', authAdmin, orders.deleteProduct);



router.patch('/updateStatus/:id', authAdmin, orders.updateStatus)
router.patch('/:id', upload.single('image'), authAdmin, orders.editOrder);
router.delete('/:id', authAdmin, orders.deleteOrder);


router.get('/status/:status', authUser, orders.fetchOrdersByStatus);
router.get('/filter-by-firm/:firmName', authUser, orders.filterProductsByFirm);
router.get('/piechart/status-summary', authUser, charts.piechart)
router.get('/piechart/productName', authUser, charts.productPiechart)
router.get('/piechart/sales', authUser, charts.salesPiechart)
router.get('/filter/search', authUser, orders.filteredOrders)
router.get('/chart/stats', authUser, charts.getOrderStatisticsDaily)
router.get('/chart/stats/monthly', authUser, charts.getOrderStatisticsMonthly)


//some new additions
router.get('/firmType/reseller', authUser, orders.getAllResellers);
router.get('/new/count', authAdmin, orders.getNewOrdersCount)
router.get('/new/count/details', authAdmin, orders.getNewOrders)
router.post('/new/count/reset', authAdmin, orders.resetNewOrders)


//update priority custom
router.patch('/updatePriority/highest/:id', authAdmin, orders.highPriority)
router.patch('/updatePriority/lowest/:id', authAdmin, orders.lowPriority)
router.patch('/updatePriority/custom/:id', authAdmin, orders.customPriority)

router.get('/order/Logs', authAdmin, orders.getOrderLogs)



// // Endpoint to fetch order logs
// router.get('/order/Log', async (req, res) => {
//     try {
//         // Fetch order logs from the database
//         const orderLogs = await fetchOrderLogsFromDatabase();

//         res.json(orderLogs);
//     } catch (error) {
//         console.error('Error fetching order logs:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Fetch order logs from the database
// async function fetchOrderLogsFromDatabase() {
//     const query = 'SELECT * FROM order_logs';
//     const [rows] = await pool.query(query);
//     return rows;
// }

// // Endpoint to generate and download PDF
// router.get('/order/Log/downloadPDF', async (req, res) => {
//     try {
//         // Fetch order logs from the backend
//         const orderLogs = await fetchOrderLogsFromDatabase();

//         // Create a new PDF document
//         const doc = new pdfkit();
//         doc.pipe(fs.createWriteStream('order_Logs.pdf'));

//         // Format and layout order logs data in the PDF
//         doc.fontSize(12);
//         orderLogs.forEach((log, index) => {
//             doc.text(`#${index + 1}: Order ID: ${log.order_id}, User ID: ${log.user_id}, Action: ${log.action}, Timestamp: ${log.timestamp}`);
//             doc.moveDown();
//         });

//         // Finalize the PDF document
//         doc.end();

//         // Send the PDF file as a response
//         res.download('order_logs.pdf');
//     } catch (error) {
//         console.error('Error generating PDF:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });


// Route for exporting the logbook data
router.get('/export/logbook', async (req, res) => {
    try {
      // Fetch logbook data from the database
      const logbookData = await fetchLogbookData();
  
      // Generate CSV file content from logbook data (You can use any format you prefer)
      const csvContent = generateCSV(logbookData);
  
      // Set response headers for file download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="logbook.csv"');
  
      // Send the CSV file content as the response
      res.status(200).send(csvContent);
    } catch (error) {
      console.error('Error exporting logbook:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Controller function to fetch logbook data from the database
// Controller function to fetch logbook data from the database
async function fetchLogbookData() {
    try {
      const [rows, fields] = await pool.query('SELECT * FROM order_logs where date(timestamp) >=curdate() -7;');
      return rows;
    } catch (error) {
      throw error;
    }
  }
  
  
  
  // Function to generate CSV content from logbook data
function generateCSV(logbookData) {
    // Define column headers for the CSV file
    const headers = ['Timestamp', 'User ID', 'Order ID', 'Action'];
  
    // Convert logbookData to CSV format
    const rows = logbookData.map(entry => {
      return [
        entry.timestamp,
        entry.user_id,
        entry.order_id,
        entry.action
        // entry.old_value,
        // entry.new_value
      ];
    });
  
    // Combine headers and rows to form the CSV content
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  
    return csvContent;
  }
  

module.exports = router;

