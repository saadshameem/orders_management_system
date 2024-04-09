const pool = require("../db/connection");
const fs = require("fs");
const path = require("path");
const { error } = require("console");

exports.getAllOrders = (req, res) => {
  // const query = 'SELECT orders.id, orders.case_no, orders.po_no, orders.price, orders.quantity,orders.firm_name, orders.customer_name, orders.customer_phone_no,  orders.sales_person_id, orders.sales_person,orders.order_status, orders.payment_status, orders.deadline_date, orders.priority, orders.image,orders.createdAt, orders.productId,products.name AS product_name FROM test.orders JOIN test.products ON orders.productId = Products.id ORDER BY orders.priority ASC';
  const query = "SELECT * FROM orders ORDER BY priority ASC";
  // const query = 'SELECT orders.*, products.name AS product_name FROM orders JOIN products ON orders.productId = Products.id  ORDER BY orders.priority ASC';

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    // Execute the query
    connection.query(query, (error, results) => {
      // Release the connection back to the pool
      connection.release();
      if (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(200).json({ orders: results });
    });
  });
};

exports.getAllProducts = (req, res) => {
  const query = "SELECT name FROM products ORDER BY id ASC";
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    // Execute the query
    connection.query(query, (error, results) => {
      // Release the connection back to the pool
      connection.release();
      if (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: error.message });
        return;
      }
      const productNames = results.map((result) => result.name);
      // Send the product names in the desired format
      res.status(200).json({ productNames });
    });
  });
};

// exports.getProductsById = (req, res) => {
//     const query = 'SELECT * FROM products ORDER BY id ASC';
//     // Get a connection from the pool
//     pool.getConnection((err, connection) => {
//         if (err) {
//             console.error('Error getting database connection:', err);
//             res.status(500).json({ error: err.message  });
//             return;
//         }
//         // Execute the query
//         connection.query(query, (error, results) => {
//             // Release the connection back to the pool
//             connection.release();
//             if (error) {
//                 console.error('Error fetching products:', error);
//                 res.status(500).json({ error: error.message  });
//                  return;
//             }
//             const productNames = results.map(result => ({id:result.id, name:result.name}));
//             // Send the product names in the desired format
//             res.status(200).json({ productNames });
//         });
//     });
// };

exports.deleteProduct = (req, res) => {
  const { name } = req.params;
  const query = "DELETE FROM products WHERE name = ?";
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    connection.query(query, [name], (error, result) => {
      connection.release();
      if (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: `product with name ${name} not found` });
      }
      res
        .status(200)
        .json({ message: `product with name ${name} deleted successfully` });
    });
  });
};

exports.AddNewProduct = (req, res) => {
  // Extract product name from the request body
  const { name } = req.body;

  // Check if the product name is provided
  if (!name) {
    return res.status(400).json({ error: "Product name is required" });
  }

  const checkUserQuery = `SELECT * FROM products WHERE name = ?`;
  pool.query(checkUserQuery, [name], async (error, results) => {
    if (error) {
      console.error("Error checking user:", error);
      res.status(500).json({ message: error.message });
      return;
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "Product already exists" });
    }

    // SQL query to insert a new product into the database
    const query = "INSERT INTO products (name) VALUES (?)";

    // Execute the query with the provided product name
    pool.query(query, [name], (error, results) => {
      if (error) {
        console.error("Error adding product:", error);
        return res.status(500).json({ error: error.message });
      }

      // Return a success response with the ID of the newly added product
      res.status(201).json({
        message: "Product added successfully",
        productId: results.insertId,
      });
    });
  });
};

// exports.createOrder = async (req, res, next) => {
//     try {
//         // Extract order data from req.body
//         const {case_no, po_no, product_name, price, quantity, deadline_date, firm_name, customer_name, customer_phone_no, sales_person, sales_person_id, order_status, payment_status, priority, image } = req.body;

//         let relativeImagePath = null;

//         if (image) {
//             // Remove the data:image/jpeg;base64, prefix
//             const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
//             const imageData = Buffer.from(base64Data, 'base64');

//             const imageFileName = `image_${case_no}.jpeg`;

//             // Define the path where you want to save the image
//             const imagePath = path.join(__dirname, '../public3/uploads/', imageFileName);
//             console.log(imagePath)

//             // Save the image to the uploads directory
//             fs.writeFile(imagePath, imageData, (err) => {
//                 if (err) {
//                     console.error('Error saving image:', err);
//                     return res.status(500).json({ error: 'Failed to save image' });
//                 }
//                 console.log('Image saved successfully');
//             });
//             relativeImagePath = `/uploads/${imageFileName}`;

//         }

//         // Save the order data to the database
//         pool.getConnection((err, connection) => {
//             if (err) {
//                 console.error('Error getting database connection:', err);
//                 return res.status(500).json({ error: 'Internal server error' });
//             }

//             const formattedDeadlineDate = new Date(deadline_date).toISOString().slice(0, 19).replace('T', ' ');

//             connection.query('INSERT INTO orders (case_no, po_no, product_name, price, quantity, deadline_date, firm_name, customer_name, customer_phone_no, sales_person, sales_person_id, order_status, payment_status, priority, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
//             [case_no ,po_no, product_name, price, quantity, formattedDeadlineDate, firm_name, customer_name, customer_phone_no, sales_person, sales_person_id, order_status, payment_status, priority, relativeImagePath],
//             (error, result) => {
//                 connection.release();
//                 if (error) {
//                     console.error('Error creating order:', error);
//                     return res.status(500).json({ error: 'Internal server error' });
//                 }
//                 return res.status(201).json({ message: 'Order created successfully', orderId: result.insertId });
//             });
//         });
//     } catch (error) {
//         console.error('Error creating order:', error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// };

// exports.createOrder = async (req, res, next) => {
//     try {
//         // Extract order data from req.body
//         const { case_no, po_no, product_name, price, quantity, deadline_date, firm_name, customer_name, customer_phone_no, sales_person, sales_person_id, order_status, payment_status, priority, image } = req.body;

//         let relativeImagePath = null;

//         if (image) {
//             // Remove the data:image/jpeg;base64, prefix
//             const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
//             const imageData = Buffer.from(base64Data, 'base64');

//             const imageFileName = `image_${case_no}.jpeg`;

//             // Define the path where you want to save the image
//             const imagePath = path.join(__dirname, '../public3/uploads/', imageFileName);

//             // Save the image to the uploads directory
//             fs.writeFile(imagePath, imageData, (err) => {
//                 if (err) {
//                     console.error('Error saving image:', err);
//                     return res.status(500).json({ error: 'Failed to save image' });
//                 }
//                 console.log('Image saved successfully');
//             });
//             relativeImagePath = `/uploads/${imageFileName}`;
//         }

//         // Fetch product ID based on product name
//         const productIdQuery = 'SELECT id FROM products WHERE name = ?';
//         pool.query(productIdQuery, [product_name], (error, results) => {
//             if (error) {
//                 console.error('Error fetching product ID:', error);
//                 return res.status(500).json({ error: 'Internal server error' });
//             }
//             if (results.length === 0) {
//                 return res.status(400).json({ error: 'Product not found' });
//             }
//             const productId = results[0].id;

//             // Save the order data to the database
//             const formattedDeadlineDate = new Date(deadline_date).toISOString().slice(0, 19).replace('T', ' ');
//             const insertOrderQuery = 'INSERT INTO orders (case_no, po_no, productId, price, quantity, deadline_date, firm_name, customer_name, customer_phone_no, sales_person, sales_person_id, order_status, payment_status, priority, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
//             pool.query(insertOrderQuery, [case_no, po_no, productId, price, quantity, formattedDeadlineDate, firm_name, customer_name, customer_phone_no, sales_person, sales_person_id, order_status, payment_status, priority, relativeImagePath], (error, result) => {
//                 if (error) {
//                     console.error('Error creating order:', error);
//                     return res.status(500).json({ error: 'Internal server error' });
//                 }
//                 return res.status(201).json({ message: 'Order created successfully', orderId: result.insertId });
//             });
//         });
//     } catch (error) {
//         console.error('Error creating order:', error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// };

exports.createOrder = async (req, res, next) => {
  try {
    // Extract order data from req.body
    const {
      case_no,
      po_no,
      product_name,
      price,
      quantity,
      deadline_date,
      firm_name,
      customer_name,
      customer_phone_no,
      sales_person,
      order_status,
      payment_status,
      priority,
      image,
    } = req.body;

    let relativeImagePath = null;

    if (image) {
      // Remove the data:image/jpeg;base64, prefix
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const imageData = Buffer.from(base64Data, "base64");

      const imageFileName = `image_${case_no}.jpeg`;

      // Define the path where you want to save the image
      const imagePath = path.join(
        __dirname,
        "../public3/uploads/",
        imageFileName
      );

      // Save the image to the uploads directory
      fs.writeFile(imagePath, imageData, (err) => {
        if (err) {
          console.error("Error saving image:", err);
          return res.status(500).json({ error: "Failed to save image" });
        }
        console.log("Image saved successfully");
      });
      relativeImagePath = `/uploads/${imageFileName}`;
    }

    // Fetch sales person ID based on sales person name
    const salesPersonIdQuery = "SELECT id FROM sales_persons WHERE name = ?";
    pool.query(salesPersonIdQuery, [sales_person], (error, results) => {
      if (error) {
        console.error("Error fetching sales person ID:", error);
        return res.status(500).json({ error: error.message });
      }
      if (results.length === 0) {
        return res.status(400).json({ error: "Sales person not found" });
      }
      const sales_person_id = results[0].id;

      // Fetch product ID based on product name
      const productIdQuery = "SELECT id FROM products WHERE name = ?";
      pool.query(productIdQuery, [product_name], (error, results) => {
        if (error) {
          console.error("Error fetching product ID:", error);
          return res.status(500).json({ error: error.message });
        }
        if (results.length === 0) {
          return res.status(400).json({ error: "Product not found" });
        }
        const productId = results[0].id;

        // Save the order data to the database
        const formattedDeadlineDate = new Date(deadline_date)
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
        const insertOrderQuery =
          "INSERT INTO orders (case_no, po_no, product_name, price, quantity, deadline_date, firm_name, customer_name, customer_phone_no,  sales_person, sales_person_id, order_status, payment_status, priority, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        pool.query(
          insertOrderQuery,
          [
            case_no,
            po_no,
            product_name,
            price,
            quantity,
            formattedDeadlineDate,
            firm_name,
            customer_name,
            customer_phone_no,
            sales_person,
            sales_person_id,
            order_status,
            payment_status,
            priority,
            relativeImagePath,
          ],
          (error, result) => {
            if (error) {
              console.error("Error creating order:", error);
              return res.status(500).json({ error: error.message });
            }
            return res.status(201).json({
              message: "Order created successfully",
              orderId: result.insertId,
            });
          }
        );
      });
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.getOrder = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM orders WHERE id = ?";
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    connection.query(query, [id], (error, results) => {
      connection.release();
      if (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ error: error.message });
        return;
      }
      if (results.length === 0) {
        return res.status(404).json({ error: `Order with id ${id} not found` });
      }
      res.status(200).json({ order: results[0] });
    });
  });
};

// exports.updateOrder = (req, res) => {
//     const { id } = req.params;
//     const { case_no, po_no,  price, quantity, firm_name, customer_name, customer_phone_no,  order_status, payment_status, deadline_date, priority } = req.body;
//     const query = 'UPDATE orders SET case_no = ?, po_no = ?,  price = ?, quantity = ?, firm_name = ?, customer_name = ?, customer_phone_no = ?,  order_status = ?, payment_status = ?, deadline_date = ?, priority = ? WHERE id = ?';
//     const values = [case_no, po_no,  price, quantity, firm_name, customer_name, customer_phone_no,  order_status, payment_status, deadline_date, priority, id];
//     pool.getConnection((err, connection) => {
//         if (err) {
//             console.error('Error getting database connection:', err);
//             res.status(500).json({ error: err.message  });
//             return;
//         }
//         connection.query(query, values, (error, result) => {
//             connection.release();
//             if (error) {
//                 console.error('Error updating order:', error);
//                 res.status(500).json({ error: error.message  });
//                 return;
//             }
//             res.status(200).json({ order: result });
//         });
//     });
// };

exports.editOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Extract updated order data from req.body
    const {
      case_no,
      po_no,
      price,
      quantity,
      firm_name,
      customer_name,
      customer_phone_no,
      order_status,
      payment_status,
      deadline_date,
      priority,
      image,
    } = req.body;

    let relativeImagePath = null;

    if (image) {
      // Remove the data:image/jpeg;base64, prefix
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const imageData = Buffer.from(base64Data, "base64");

      const imageFileName = `image_${case_no}.jpeg`;

      // Define the path where you want to save the image
      const imagePath = path.join(
        __dirname,
        "../public3/uploads/",
        imageFileName
      );

      // Save the image to the uploads directory
      fs.writeFile(imagePath, imageData, (err) => {
        if (err) {
          console.error("Error saving image:", err);
          return res.status(500).json({ error: "Failed to save image" });
        }
        console.log("Image saved successfully");
      });
      relativeImagePath = `/uploads/${imageFileName}`;
    }

    // Update the order in the database, including the new image path if provided
    const updateOrderQuery =
      "UPDATE orders SET case_no = ?, po_no = ?,  price = ?, quantity = ?, firm_name = ?, customer_name = ?, customer_phone_no = ?,  order_status = ?, payment_status = ?, deadline_date = ?, priority = ?, image = ? WHERE id = ?";
    const values = [
      case_no,
      po_no,
      price,
      quantity,
      firm_name,
      customer_name,
      customer_phone_no,
      order_status,
      payment_status,
      deadline_date,
      priority,
      relativeImagePath,
      id,
    ];

    pool.query(updateOrderQuery, values, (error, result) => {
      if (error) {
        console.error("Error updating order:", error);
        return res.status(500).json({ error: error.message });
      }
      return res.status(200).json({ message: "Order updated successfully" });
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteOrder = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM orders WHERE id = ?";
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    connection.query(query, [id], (error, result) => {
      connection.release();
      if (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: `Order with id ${id} not found` });
      }
      res
        .status(200)
        .json({ message: `Order with id ${id} deleted successfully` });
    });
  });
};

exports.filterProductsByFirm = (req, res) => {
  const { firmName } = req.params;
  const query =
    "SELECT * FROM orders WHERE firm_name = ? ORDER BY priority ASC";
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    connection.query(query, [firmName], (error, results) => {
      connection.release();
      if (error) {
        console.error("Error fetching orders by firm:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      if (results.length === 0) {
        return res
          .status(404)
          .json({ error: `No orders found for firm: ${firmName}` });
      }
      res.status(200).json({ orders: results, count: results.length });
    });
  });
};

exports.fetchOrdersByStatus = (req, res) => {
  const { status } = req.params;
  const query =
    "Select * from orders WHERE orders.order_status = ? ORDER BY orders.priority ASC";
  // const query = 'SELECT orders.id, orders.case_no, orders.po_no, orders.price, orders.quantity,orders.firm_name, orders.customer_name, orders.customer_phone_no,  orders.sales_person_id, orders.sales_person,orders.order_status, orders.payment_status, orders.deadline_date, orders.priority, orders.image,orders.createdAt, orders.productId,products.name AS product_name FROM test.orders JOIN test.products ON orders.productId = Products.id WHERE orders.order_status = ? ORDER BY orders.priority ASC';
  // const query = 'SELECT orders.*, products.name AS product_name FROM orders JOIN products ON orders.productId = Products.id WHERE orders.order_status = ? ORDER BY orders.priority ASC';
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    connection.query(query, [status], (error, results) => {
      connection.release();
      if (error) {
        console.error("Error fetching orders by status:", error);
        res.status(500).json({ error: error.message });
        return;
      }
      if (results.length === 0) {
        return res
          .status(404)
          .json({ error: `No orders found with status: ${status}` });
      }
      res.status(200).json({ orders: results, count: results.length });
    });
  });
};

// exports.fetchOrdersByStatus = (req, res) => {
//     const { order_status } = req.query;
//     const query = 'SELECT * FROM orders WHERE order_status = ? ORDER BY priority ASC';

//     pool.getConnection((err, connection) => {
//         if (err) {
//             console.error('Error getting database connection:', err);
//             res.status(500).json({ error: 'Internal server error' });
//             return;
//         }

//         connection.query(query, [order_status], (error, results) => {
//             connection.release();
//             if (error) {
//                 console.error('Error fetching orders by status:', error);
//                 res.status(500).json({ error: 'Internal server error' });
//                 return;
//             }
//             res.status(200).json({ orders: results });
//         });
//     });
// };

exports.filteredOrders = (req, res) => {
  const { attribute, search } = req.query;
  let query;
  switch (attribute) {
    case "case_no":
    case "product_name":
    case "firm_name":
    case "sales_person":
      query = `SELECT * FROM orders WHERE ${attribute} LIKE ?`;

      //  query = `SELECT orders.id, orders.case_no, orders.po_no, orders.price, orders.quantity,orders.firm_name, orders.customer_name, orders.customer_phone_no,  orders.sales_person_id, orders.sales_person,orders.order_status, orders.payment_status, orders.deadline_date, orders.priority, orders.image,orders.createdAt, orders.productId,products.name AS product_name FROM test.orders JOIN test.products ON orders.productId = Products.id WHERE ${attribute} LIKE ? ORDER BY orders.priority ASC`;

      //   query = `SELECT orders.*, products.name AS product_name FROM orders JOIN products ON orders.productId = Products.id WHERE ${attribute} LIKE ? ORDER BY orders.priority ASC`;

      break;
    default:
      return res.status(400).json({ error: "Invalid filter attribute" });
  }
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    connection.query(query, [`%${search}%`], (error, results) => {
      connection.release();
      if (error) {
        console.error("Error filtering orders:", error);
        res.status(500).json({ error: error.message });
        return;
      }
      if (results.length === 0) {
        return res.status(404).json({
          message: "No orders found with this attribute and search term",
        });
      }
      res.status(200).json({ orders: results });
    });
  });
};

exports.getNewOrderDetails = (req, res) => {
  const query =
    "SELECT MAX(CAST(SUBSTRING(case_no, 5) AS UNSIGNED)) AS highest_case_number FROM orders";

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      res.status(500).json({ error: err.message });
      return;
    }

    connection.query(query, (error, results) => {
      connection.release();
      if (error) {
        console.error("Error fetching new order details:", error);
        res.status(500).json({ error: error.message });
        return;
      }
      const highestCaseNumber = results[0].highest_case_number || 0;
      // const newCaseNo = 'CASE' + String(maxCaseNo + 1).padStart(5, '0');
      const priority = highestCaseNumber + 1;

      res.status(200).json({ highestCaseNumber, priority });
    });
  });
};
