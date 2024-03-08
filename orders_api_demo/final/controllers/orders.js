


const mysql2 = require('mysql2');
const dbConfig = require('../db/connect'); // Import database connection configuration

// Create a connection pool
const pool = mysql2.createPool({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '0987poiu',
    database: 'test',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

exports.getAllOrders = (req, res) => {
    const query = 'SELECT * FROM Orders ORDER BY priority ASC';
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
      // Extract data from request body
      const {  case_no, po_no, product_name, price, quantity, firm_name, customer_name, customer_phone_no, sales_person, sales_person_id, order_status, payment_status, deadline_date, priority } = req.body;


      const deadline = new Date(deadline_date);
        const formattedDeadlineDate = `${deadline.getFullYear()}-${(deadline.getMonth() + 1).toString().padStart(2, '0')}-${deadline.getDate().toString().padStart(2, '0')}`;

      // Get a connection from the pool
      pool.getConnection((err, connection) => {
          if (err) {
              console.error('Error getting database connection:', err);
              res.status(500).json({ error: 'Internal server error' });
              return;
          }
          // Execute the query
          connection.query('INSERT INTO Orders (case_no, po_no, product_name, price, quantity, firm_name, customer_name, customer_phone_no, sales_person, sales_person_id, order_status, payment_status, deadline_date, priority) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',  [case_no, po_no, product_name, price, quantity, firm_name, customer_name, customer_phone_no, sales_person, sales_person_id, order_status, payment_status, formattedDeadlineDate, priority], (error, result) => {
              // Release the connection back to the pool
              connection.release();
              if (error) {
                  console.error('Error creating order:', error);
                  res.status(500).json({ error: 'Internal server error' });
                  return;
              }
              res.status(201).json({ message: 'Order created successfully', orderId: result.insertId });
          });
      });
  } catch (error) {
      console.error('Error creating order:', error);
      next(new ErrorHandler(500, 'Internal server error'));
  }

  
};





exports.getOrder = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM Orders WHERE id = ?';
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
  const query = 'DELETE FROM Orders WHERE id = ?';
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
  const query = 'SELECT * FROM Orders WHERE firm_name = ? ORDER BY priority ASC';
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


exports.fetchOrdersByStatus = (req, res) => {
  const { status } = req.params;
  const query = 'SELECT * FROM Orders WHERE order_status = ?';
  pool.getConnection((err, connection) => {
      if (err) {
          console.error('Error getting database connection:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      connection.query(query, [status], (error, results) => {
          connection.release();
          if (error) {
              console.error('Error fetching orders by status:', error);
              res.status(500).json({ error: 'Internal server error' });
              return;
          }
          if (results.length === 0) {
              return res.status(404).json({ error: `No orders found with status: ${status}` });
          }
          res.status(200).json({ orders: results, count: results.length });
      });
  });
};





exports.piechart = (req, res) => {
  const query = 'SELECT order_status, COUNT(*) AS count FROM Orders GROUP BY order_status';
  pool.getConnection((err, connection) => {
      if (err) {
          console.error('Error getting database connection:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      connection.query(query, (error, results) => {
          connection.release();
          if (error) {
              console.error('Error fetching pie chart data:', error);
              res.status(500).json({ error: 'Internal server error' });
              return;
          }
          const summaryData = {};
          results.forEach(item => {
              summaryData[item.order_status] = item.count;
          });
          res.json(summaryData);
      });
  });
};

exports.productPiechart = (req, res) => {
  const query = 'SELECT product_name, COUNT(*) AS count FROM Orders GROUP BY product_name';
  pool.getConnection((err, connection) => {
      if (err) {
          console.error('Error getting database connection:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      connection.query(query, (error, results) => {
          connection.release();
          if (error) {
              console.error('Error fetching product pie chart data:', error);
              res.status(500).json({ error: 'Internal server error' });
              return;
          }
          const summaryData = {};
          results.forEach(item => {
              summaryData[item.product_name] = item.count;
          });
          res.json(summaryData);
      });
  });
};



exports.salesPiechart = (req, res) => {
  const { year, month } = req.query;
  const query = `
      SELECT sales_person, SUM(CAST(SUBSTRING_INDEX(price, ".", -1) AS DECIMAL(10,2)) * quantity) AS total_amount
      FROM Orders
      WHERE YEAR(createdAt) = ? AND MONTH(createdAt) = ?
      GROUP BY sales_person
  `;
  pool.getConnection((err, connection) => {
      if (err) {
          console.error('Error getting database connection:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      connection.query(query, [year, month], (error, results) => {
          connection.release();
          if (error) {
              console.error('Error fetching sales pie chart data:', error);
              res.status(500).json({ error: 'Internal server error' });
              return;
          }
          const summaryData = {};
          results.forEach(item => {
              summaryData[item.sales_person] = item.total_amount;
          });
          res.json(summaryData);
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
          query = `SELECT * FROM Orders WHERE ${attribute} LIKE ?`;
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


exports.getOrderStatisticsMonthly = (req, res) => {
  const startDate = new Date(new Date().getFullYear(), 0, 1); // Start of the current year
  const endDate = new Date(new Date().getFullYear() + 1, 0, 1); // Start of the next year
  const query = `
      SELECT
          MONTH(createdAt) AS month,
          SUM(CASE WHEN order_status = 'shipped' THEN 1 ELSE 0 END) AS shippedCount,
          COUNT(*) AS receivedCount
      FROM Orders
      WHERE createdAt BETWEEN ? AND ?
      GROUP BY MONTH(createdAt)
  `;
  pool.getConnection((err, connection) => {
      if (err) {
          console.error('Error getting database connection:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      connection.query(query, [startDate, endDate], (error, results) => {
          connection.release();
          if (error) {
              console.error('Error fetching order statistics:', error);
              res.status(500).json({ error: 'Internal server error' });
              return;
          }
          const monthlyData = [];
          for (let i = 1; i <= 12; i++) {
              const monthData = results.find(stat => stat.month === i) || { month: i, receivedCount: 0, shippedCount: 0 };
              monthlyData.push(monthData);
          }
          res.status(200).json({ monthlyData });
      });
  });
};




exports.getOrderStatisticsDaily = (req, res) => {
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 14); // Start date is 14 days ago
  const dateArray = [];
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      dateArray.push(new Date(date));
  }
  const query = `
      SELECT
          DATE(createdAt) AS date,
          SUM(CASE WHEN order_status = 'shipped' THEN 1 ELSE 0 END) AS shippedCount,
          COUNT(*) AS receivedCount
      FROM Orders
      WHERE createdAt BETWEEN ? AND ?
      GROUP BY DATE(createdAt)
  `;
  pool.getConnection((err, connection) => {
      if (err) {
          console.error('Error getting database connection:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
      }
      connection.query(query, [startDate, endDate], (error, results) => {
          connection.release();
          if (error) {
              console.error('Error fetching daily order statistics:', error);
              res.status(500).json({ error: 'Internal server error' });
              return;
          }
          const formattedData = dateArray.map(date => {
              const matchingData = results.find(stat => new Date(stat.date).toDateString() === date.toDateString());
              return {
                  date: date.toDateString(),
                  receivedCount: matchingData ? matchingData.receivedCount : 0,
                  shippedCount: matchingData ? matchingData.shippedCount : 0
              };
          });
          res.status(200).json({ orderStats: formattedData });
      });
  });
};