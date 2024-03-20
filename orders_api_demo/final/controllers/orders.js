


const mysql2 = require('mysql2');
const dbConfig = require('../db/connect'); // Import database connection configuration
const pool = require('../db/connect');
const fs = require('fs')
const path = require('path')



exports.getAllOrders = (req, res) => {
    const query = 'SELECT * FROM orders ORDER BY priority ASC';
    // Get a connection from the pool
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        // Execute the query
        connection.query(query, (error, results) => {
            // Release the connection back to the pool
            connection.release();
            if (error) {
                console.error('Error fetching orders:', error);
                res.status(500).json({ error: 'Internal server error' });               
                 return;
            }
            res.status(200).json({ orders: results });
        });
    });
};

exports.createOrder = async (req, res, next) => {
    try {
        // Extract order data from req.body
        const {case_no, po_no, product_name, price, quantity, deadline_date, firm_name, customer_name, customer_phone_no, sales_person, sales_person_id, order_status, payment_status, priority, image } = req.body;


        let relativeImagePath = null;

        if (image) {
            // Remove the data:image/jpeg;base64, prefix
            const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
            const imageData = Buffer.from(base64Data, 'base64');

            const imageFileName = `image_${case_no}.jpeg`;


            // Define the path where you want to save the image
            const imagePath = path.join(__dirname, '../public3/uploads/', imageFileName);
            console.log(imagePath)

            // Save the image to the uploads directory
            fs.writeFile(imagePath, imageData, (err) => {
                if (err) {
                    console.error('Error saving image:', err);
                    return res.status(500).json({ error: 'Failed to save image' });
                }
                console.log('Image saved successfully');
            });
            relativeImagePath = `/uploads/${imageFileName}`;

        }

        // Save the order data to the database
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting database connection:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            const formattedDeadlineDate = new Date(deadline_date).toISOString().slice(0, 19).replace('T', ' ');

            connection.query('INSERT INTO Orders (case_no, po_no, product_name, price, quantity, deadline_date, firm_name, customer_name, customer_phone_no, sales_person, sales_person_id, order_status, payment_status, priority, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
            [case_no ,po_no, product_name, price, quantity, formattedDeadlineDate, firm_name, customer_name, customer_phone_no, sales_person, sales_person_id, order_status, payment_status, priority, relativeImagePath], 
            (error, result) => {
                connection.release();
                if (error) {
                    console.error('Error creating order:', error);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                return res.status(201).json({ message: 'Order created successfully', orderId: result.insertId });
            });
        });
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getOrder = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM orders WHERE id = ?';
  pool.getConnection((err, connection) => {
      if (err) {
          console.error('Error getting database connection:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      connection.query(query, [id], (error, results) => {
          connection.release();
          if (error) {
              console.error('Error fetching order:', error);
              res.status(500).json({ error: 'Internal server error' });
              return;
          }
          if (results.length === 0) {
              return res.status(404).json({ error: `Order with id ${id} not found` });
          }
          res.status(200).json({ order: results[0] });
      });
  });
};

exports.updateOrder = (req, res) => {
  const { id } = req.params;
  const { case_no, po_no, product_name, price, quantity, firm_name, customer_name, customer_phone_no, sales_person, sales_person_id, order_status, payment_status, deadline_date, priority } = req.body;
  const query = 'UPDATE Orders SET case_no = ?, po_no = ?, product_name = ?, price = ?, quantity = ?, firm_name = ?, customer_name = ?, customer_phone_no = ?, sales_person = ?, sales_person_id = ?, order_status = ?, payment_status = ?, deadline_date = ?, priority = ? WHERE id = ?';
  const values = [case_no, po_no, product_name, price, quantity, firm_name, customer_name, customer_phone_no, sales_person, sales_person_id, order_status, payment_status, deadline_date, priority, id];
  pool.getConnection((err, connection) => {
      if (err) {
          console.error('Error getting database connection:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      connection.query(query, values, (error, result) => {
          connection.release();
          if (error) {
              console.error('Error updating order:', error);
              res.status(500).json({ error: 'Internal server error' });
              return;
          }
          res.status(200).json({ order: result });
      });
  });
};


exports.deleteOrder = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM orders WHERE id = ?';
  pool.getConnection((err, connection) => {
      if (err) {
          console.error('Error getting database connection:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      connection.query(query, [id], (error, result) => {
          connection.release();
          if (error) {
              console.error('Error deleting order:', error);
              res.status(500).json({ error: 'Internal server error' });
              return;
          }
          if (result.affectedRows === 0) {
              return res.status(404).json({ error: `Order with id ${id} not found` });
          }
          res.status(200).json({ message: `Order with id ${id} deleted successfully` });
      });
  });
};

exports.filterProductsByFirm = (req, res) => {
  const { firmName } = req.params;
  const query = 'SELECT * FROM orders WHERE firm_name = ? ORDER BY priority ASC';
  pool.getConnection((err, connection) => {
      if (err) {
          console.error('Error getting database connection:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      connection.query(query, [firmName], (error, results) => {
          connection.release();
          if (error) {
              console.error('Error fetching orders by firm:', error);
              res.status(500).json({ error: 'Internal server error' });
              return;
          }
          if (results.length === 0) {
              return res.status(404).json({ error: `No orders found for firm: ${firmName}` });
          }
          res.status(200).json({ orders: results, count: results.length });
      });
  });
};

// exports.fetchOrdersByStatus = (req, res) => {
//     const { status } = req.params;
//     const query = 'SELECT * FROM orders WHERE order_status = ?';
//     pool.getConnection((err, connection) => {
//       if (err) {
//         console.error('Error getting database connection:', err);
//         res.status(500).json({ error: 'Internal server error' });
//         return;
//       }
//       connection.query(query, [status], (error, results) => {
//         connection.release();
//         if (error) {
//           console.error('Error fetching orders by status:', error);
//           res.status(500).json({ error: 'Internal server error' });
//           return;
//         }
//         if (results.length === 0) {
//           return res.status(404).json({ error: `No orders found with status: ${status}` });
//         }
//         res.status(200).json({ orders: results, count: results.length });
//       });
//     });
//   };

exports.fetchOrdersByStatus = (req, res) => {
    const { order_status } = req.query;
    const query = 'SELECT * FROM orders WHERE order_status = ? ORDER BY priority ASC';

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        connection.query(query, [order_status], (error, results) => {
            connection.release();
            if (error) {
                console.error('Error fetching orders by status:', error);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.status(200).json({ orders: results });
        });
    });
};

exports.filteredOrders = (req, res) => {
  const { attribute, search } = req.query;
  let query;
  switch (attribute) {
      case 'case_no':
      case 'product_name':
      case 'firm_name':
      case 'sales_person':
          query = `SELECT * FROM orders WHERE ${attribute} LIKE ?`;
          break;
      default:
          return res.status(400).json({ error: 'Invalid filter attribute' });
  }
  pool.getConnection((err, connection) => {
      if (err) {
          console.error('Error getting database connection:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      connection.query(query, [`%${search}%`], (error, results) => {
          connection.release();
          if (error) {
              console.error('Error filtering orders:', error);
              res.status(500).json({ error: 'Internal server error' });
              return;
          }
          if (results.length === 0) {
              return res.status(404).json({ message: 'No orders found with this attribute and search term' });
          }
          res.status(200).json({ orders: results });
      });
  });
};

exports.getNewOrderDetails = (req, res) => {
        const query = 'SELECT MAX(CAST(SUBSTRING(case_no, 5) AS UNSIGNED)) AS highest_case_number FROM orders';

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        connection.query(query, (error, results) => {
            connection.release();
            if (error) {
                console.error('Error fetching new order details:', error);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            const highestCaseNumber = results[0].highest_case_number || 0;
            // const newCaseNo = 'CASE' + String(maxCaseNo + 1).padStart(5, '0');
            const priority = highestCaseNumber + 1;

            res.status(200).json({ highestCaseNumber, priority });
        });
    });
};