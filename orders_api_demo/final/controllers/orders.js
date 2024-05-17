


const mysql2 = require('mysql2');
const dbConfig = require('../db/connect'); // Import database connection configuration
const pool = require('../db/connect');
const fs = require('fs')
const path = require('path');
const { error, log } = require('console');




exports.getAllOrders = async (req, res) => {
    try {
        const query = 'SELECT * FROM orders  WHERE order_status != "Shipped" ORDER BY priority ASC';

        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Execute the query
        const [results] = await connection.query(query);

        // Release the connection back to the pool
        connection.release();

        res.status(200).json({ orders: results });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: error.message });
    }
};



exports.getAllProducts = async (req, res) => {

    try {
        const query = 'SELECT name FROM products ORDER BY name ASC';
        // Get a connection from the pool
        const connection = await pool.getConnection();
        // Execute the query
        const [results] = await connection.query(query);
        // Release the connection back to the pool
        connection.release();
        const productNames = results.map(result => result.name);
        // Send the product names in the desired format
        res.status(200).json({ productNames });

    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: error.message });
    }



};


exports.deleteProduct = async (req, res) => {
    try {
        const { name } = req.params;
        const query = 'DELETE FROM products WHERE name = ?';

        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Execute the query
        const [result] = await connection.query(query, [name]);

        // Release the connection back to the pool
        connection.release();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Product with name ${name} not found` });
        }

        res.status(200).json({ message: `Product with name ${name} deleted successfully` });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.AddNewProduct = async (req, res) => {
    try {
        // Extract product name from the request body
        const { name } = req.body;

        // Check if the product name is provided
        if (!name) {
            return res.status(400).json({ error: 'Product name is required' });
        }

        // Check if the product already exists
        const checkProductQuery = `SELECT * FROM products WHERE name = ?`;
        const [existingProducts] = await pool.query(checkProductQuery, [name]);

        if (existingProducts.length > 0) {
            return res.status(400).json({ message: 'Product already exists' });
        }

        // SQL query to insert a new product into the database
        const insertProductQuery = 'INSERT INTO products (name) VALUES (?)';

        // Execute the query with the provided product name
        const [result] = await pool.query(insertProductQuery, [name]);

        // Return a success response with the ID of the newly added product
        res.status(201).json({ message: 'Product added successfully', productId: result.insertId });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: error.message });
    }
};


exports.createOrder = async (req, res, next) => {
    try {
        const user_id = req.user.userId;
        const user_name = req.user.name;

        const [maxCaseNumberRow] = await pool.query('SELECT MAX(case_no) AS max_case_no FROM orders');
        const maxCaseNumber = maxCaseNumberRow[0].max_case_no || 0;

        const [maxPriorityRow] = await pool.query('SELECT Max(priority) AS max_priority FROM orders');
        const maxPriority = maxPriorityRow[0].max_priority || 0;

        const { po_no, product_name, price, quantity, deadline_date, firm_type, firm_name, customer_name, customer_phone_no, order_status, payment_status, remark, image } = req.body;

        const newCaseNumber = 'CASE' + ('00000' + (parseInt(maxCaseNumber.replace('CASE', ''), 10) + 1)).slice(-5);
        const newPriority = maxPriority + 1;

        let relativeImagePath = null;
        if (image) {
            const [fileType, base64Data] = image.split(';base64,');
            const fileExtension = fileType.split('/')[1];
            const fileData = Buffer.from(base64Data, 'base64');
            const fileName = `file_${newCaseNumber}.${fileExtension}`;
            const filePath = path.join(__dirname, '../public3/uploads/', fileName);
            await fs.promises.writeFile(filePath, fileData);
            relativeImagePath = `/uploads/${fileName}`;
        }

        const formattedDeadlineDate = new Date(deadline_date).toISOString().slice(0, 19).replace('T', ' ');
        const insertOrderQuery = 'INSERT INTO orders (case_no, po_no, product_name, price, quantity, deadline_date, firm_type, firm_name, customer_name, customer_phone_no,  sales_person, sales_person_id, order_status, payment_status, priority, remark, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const result = await pool.query(insertOrderQuery, [newCaseNumber, po_no, product_name, price, quantity, formattedDeadlineDate, firm_type, firm_name, customer_name, customer_phone_no, user_name, user_id, order_status, payment_status, newPriority, remark, relativeImagePath]);

        // After adding the new order, update user_new_orders table
        await updateAllUserNewOrders(result[0].insertId);

        return res.status(201).json({ message: 'Order created successfully', orderId: result[0].insertId });
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ error: error.message });
    }
};

// Function to update user_new_orders table for all users
const updateAllUserNewOrders = async (orderId) => {
    try {
        // Retrieve all users
        const usersQuery = 'SELECT id FROM users';
        const [users] = await pool.query(usersQuery);

        // Update user_new_orders for each user
        for (const user of users) {
            await addNewOrder(user.id, orderId);
        }

        // Return success message or handle further operations
        return 'User new orders updated successfully';
    } catch (error) {
        console.error('Error updating user new orders:', error);
        throw error;
    }
};

// Function to add new order to user_new_orders table
const addNewOrder = async (userId, orderId) => {
    try {
        // Retrieve the current user's new orders information
        const userOrdersQuery = 'SELECT order_ids, new_orders_count FROM user_new_orders WHERE user_id = ?';
        const [userOrders] = await pool.query(userOrdersQuery, [userId]);

        if (userOrders.length === 0) {
            // If no entry exists for the user, insert a new row
            const insertQuery = 'INSERT INTO user_new_orders (user_id, order_ids, new_orders_count) VALUES (?, ?, ?)';
            await pool.query(insertQuery, [userId, JSON.stringify([orderId]), 1]);

            // Return success message or handle further operations
            return 'New order added successfully';
        }

        // Extract order IDs and new orders count
        const { order_ids, new_orders_count } = userOrders[0];

        // Append the new order ID to the order_ids list
        const updatedOrderIds = order_ids ? [...JSON.parse(order_ids), orderId] : [orderId];

        // Increment the new orders count
        const updatedNewOrdersCount = new_orders_count + 1;

        // Update user's new orders information in the database
        const updateQuery = 'UPDATE user_new_orders SET order_ids = ?, new_orders_count = ? WHERE user_id = ?';
        await pool.query(updateQuery, [JSON.stringify(updatedOrderIds), updatedNewOrdersCount, userId]);

        // Return success message or handle further operations
        return 'New order added successfully';
    } catch (error) {
        console.error('Error adding new order to user_new_orders:', error);
        throw error;
    }
};


exports.getOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM orders WHERE id = ?';
        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Execute the query
        const [results] = await connection.query(query, [id]);

        // Release the connection back to the pool
        connection.release();
        if (results.length === 0) {
            return res.status(404).json({ error: `Order with id ${id} not found` });
        }
        res.status(200).json({ order: results[0] });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: error.message });
    }
};


exports.editOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {  po_no, price, quantity, firm_name, customer_name, customer_phone_no, order_status, sales_person, payment_status, deadline_date, priority, remark, image } = req.body;
        const userId = req.user.userId;

        let relativeImagePath = null;

        if (image) {
            const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
            const imageData = Buffer.from(base64Data, 'base64');
            const imageFileName = `image_${id}.jpeg`;
            const imagePath = path.join(__dirname, '../public3/uploads/', imageFileName);

            await fs.promises.writeFile(imagePath, imageData);
            relativeImagePath = `/uploads/${imageFileName}`;
        }

        const salesPersonIdQuery = 'SELECT id FROM sales_persons WHERE name = ?';
        const [salesPersonRows] = await pool.query(salesPersonIdQuery, [sales_person]);
        const sales_person_id = salesPersonRows.length ? salesPersonRows[0].id : null;

        // const updateOrderQuery = 'UPDATE orders SET case_no = ?, po_no = ?, price = ?, quantity = ?, firm_name = ?, customer_name = ?, customer_phone_no = ?, order_status = ?, sales_person = ?, sales_person_id = ?, payment_status = ?, deadline_date = ?, priority = ?, remark = ?, image = ? WHERE id = ?';
        // const values = [case_no, po_no, price, quantity, firm_name, customer_name, customer_phone_no, order_status, sales_person, sales_person_id, payment_status, deadline_date, priority, remark, relativeImagePath, id];

        let updateOrderQuery, values;
        if (image) {
            updateOrderQuery = 'UPDATE orders SET  po_no = ?, price = ?, quantity = ?, firm_name = ?, customer_name = ?, customer_phone_no = ?, order_status = ?, sales_person = ?, sales_person_id = ?, payment_status = ?, deadline_date = ?, priority = ?, remark = ?, image = ? WHERE id = ?';
            values = [ po_no, price, quantity, firm_name, customer_name, customer_phone_no, order_status, sales_person, sales_person_id, payment_status, deadline_date, priority, remark, relativeImagePath, id];
        } else {
            updateOrderQuery = 'UPDATE orders SET  po_no = ?, price = ?, quantity = ?, firm_name = ?, customer_name = ?, customer_phone_no = ?, order_status = ?, sales_person = ?, sales_person_id = ?, payment_status = ?, deadline_date = ?, priority = ?, remark = ? WHERE id = ?';
            values = [ po_no, price, quantity, firm_name, customer_name, customer_phone_no, order_status, sales_person, sales_person_id, payment_status, deadline_date, priority, remark, id];
        }

        const connection = await pool.getConnection();
        await connection.beginTransaction();
       



        const existingOrderQuery = 'SELECT * FROM orders WHERE id = ?';
        const [existingOrderRows] = await connection.query(existingOrderQuery, [id]);
        const existingOrder = existingOrderRows[0];
        // Determine which fields are being updated and their old and new values
        const changedFields = [];
if (existingOrder) {
    
    if (po_no !== existingOrder.po_no) {
        changedFields.push({ field: 'po_no', oldValue: existingOrder.po_no, newValue: po_no });
    }
    if (price !== existingOrder.price) {
        changedFields.push({ field: 'price', oldValue: existingOrder.price, newValue: price });
    }
    
    if (quantity !== existingOrder.quantity) {
        changedFields.push({ field: 'quantity', oldValue: existingOrder.quantity, newValue: quantity });
    }
    // if (deadline_date !== existingOrder.deadline_date) {
    //     changedFields.push({ field: 'deadline_date', oldValue: existingOrder.deadline_date, newValue: deadline_date });
    // }
    if (firm_name != existingOrder.firm_name) {
        changedFields.push({ field: 'firm_name', oldValue: existingOrder.firm_name, newValue: firm_name });
    }
    if (customer_name != existingOrder.customer_name) {
        changedFields.push({ field: 'customer_name', oldValue: existingOrder.customer_name, newValue: customer_name });
    }
    if (customer_phone_no != existingOrder.customer_phone_no) {
        changedFields.push({ field: 'customer_phone_no', oldValue: existingOrder.customer_phone_no, newValue: customer_phone_no });
    }
    if (sales_person != existingOrder.sales_person) {
        changedFields.push({ field: 'sales_person', oldValue: existingOrder.sales_person, newValue: sales_person });
    }
    if (payment_status != existingOrder.payment_status) {
        changedFields.push({ field: 'payment_status', oldValue: existingOrder.payment_status, newValue: payment_status });
    }
    if (remark != existingOrder.remark) {
        changedFields.push({ field: 'remark', oldValue: existingOrder.remark, newValue: remark });
    }
    if (image != existingOrder.image) {
        changedFields.push({ field: 'image', oldValue: 'oldImage', newValue: 'newImage' });
    }
   
}
        
        await connection.query(updateOrderQuery, values);

        let logMessage = null;
if (changedFields.length > 0) {
    logMessage = 'Order updated :- ';
    logMessage += changedFields.map(field => `${field.field}: ${field.oldValue} => ${field.newValue}`).join(',  ').substring(0, 255);
    console.log(logMessage);
}
 
// else {
//     logMessage += 'No changes';
// }

        // Insert the log entry into the order_logs table
        if (logMessage) {
        const logQuery = 'INSERT INTO order_logs (order_id, user_id, action, details) VALUES (?, ?, ?, ?)';
        const logValues = [id, userId, logMessage, JSON.stringify(changedFields)];
        await connection.query(logQuery, logValues);
        }



        // const logQuery = 'INSERT INTO order_logs (order_id, user_id, action) VALUES (?, ?, ?)';
        // const logValues = [id, userId, `Order updated`];
        // await connection.query(logQuery, logValues);

        await connection.commit();
        connection.release();

        return res.status(200).json({ message: 'Order updated successfully' });
    } catch (error) {
        console.error('Error updating order:', error);
        return res.status(500).json({ error: error.message });
    }
};








exports.updateStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { order_status } = req.body;
        const userId = req.user.userId; // Assuming you have user information stored in the request object

        // Perform the update operation
        const updateQuery = 'UPDATE orders SET order_status = ? WHERE id = ?';
        const values = [order_status, id];
        const connection = await pool.getConnection();

        await connection.beginTransaction();

        // Update the order status
        const [updateResult] = await connection.query(updateQuery, values);

        if (updateResult.affectedRows === 0) {
            connection.release();
            return res.status(404).json({ error: 'Order not found' });
        }

        // Insert log entry
        const logQuery = 'INSERT INTO order_logs (order_id, user_id, action) VALUES (?, ?, ?)';
        const logValues = [id, userId, `Order status updated to ${order_status}`];
        await connection.query(logQuery, logValues);

        await connection.commit();
        connection.release();

        res.status(200).json({ message: 'Order status updated successfully' });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: error.message });
    }
};


exports.lowPriority = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId


        const updateQuery = 'UPDATE orders SET priority = (SELECT IFNULL(MAX(priority), 0) + 1 FROM (SELECT * FROM orders) AS temp) WHERE id = ?;';
        const values = [id];
        const connection = await pool.getConnection();

        await connection.beginTransaction();

        const [result] = await connection.query(updateQuery, values);
        // connection.release();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Insert log entry
        const logQuery = 'INSERT INTO order_logs (order_id, user_id, action) VALUES (?, ?, ?)';
        const logValues = [id, userId, `Priority updated to lowest`];
        await connection.query(logQuery, logValues);

        await connection.commit();
        connection.release();

        res.status(200).json({ message: 'Priority updated to lowest successfully' });
    } catch (error) {
        // Handle errors
        console.error('Error updating priority to highest:', error);
        res.status(500).json({ error: error.message });
    }
};



exports.highPriority = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId


        const updateQuery = 'UPDATE orders SET priority = (SELECT IFNULL(MIN(priority), 0) - 1 FROM (SELECT * FROM orders) AS temp) WHERE id = ?';
        const values = [id];
        const connection = await pool.getConnection();

        await connection.beginTransaction();

        const [result] = await connection.query(updateQuery, values);
        // connection.release();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Insert log entry
        const logQuery = 'INSERT INTO order_logs (order_id, user_id, action) VALUES (?, ?, ?)';
        const logValues = [id, userId, `Priority updated to highest`];
        await connection.query(logQuery, logValues);

        await connection.commit();
        connection.release();

        res.status(200).json({ message: 'Priority updated to highest successfully' });
    } catch (error) {
        // Handle errors
        console.error('Error updating priority to lowest:', error);
        res.status(500).json({ error: error.message });
    }
};



// exports.customPriority = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const { priority } = req.body;
//         const userId = req.user.userId

//         // Check if priority is a valid integer
//         if (!Number.isInteger(priority)) {
//             return res.status(400).json({ error: 'Priority must be an integer' });
//         }

//         const updateQuery = 'UPDATE orders SET priority = ? WHERE id = ?';
//         const values = [priority, id]
//         const connection = await pool.getConnection();

//         await connection.beginTransaction();

//         const [result] = await connection.query(updateQuery, values);
//         // connection.release();

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ error: 'Order not found' });
//         }

//         // Insert log entry
//         const logQuery = 'INSERT INTO order_logs (order_id, user_id, action) VALUES (?, ?, ?)';
//         const logValues = [id, userId, `Priority updated to ${priority}`];
//         await connection.query(logQuery, logValues);

//         await connection.commit();
//         connection.release();

//         res.status(200).json({ message: 'Priority updated successfully ' })
//     } catch (error) {
//         console.error('Error updating priority:', error);
//         res.status(500).json({ error: error.message });
//     }
// };

exports.customPriority = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { priority } = req.body;

        // Check if priority is a valid integer
        if (!Number.isInteger(priority)) {
            return res.status(400).json({ error: 'Priority must be an integer' });
        }

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        // Get the current priority of the specified order
        const [orderRows] = await connection.query('SELECT priority FROM orders WHERE id = ?', [id]);
        if (orderRows.length === 0) {
            await connection.rollback();
            connection.release();
            return res.status(404).json({ error: 'Order not found' });
        }

        const currentPriority = orderRows[0].priority;
        console.log('###############',currentPriority);
        const newPriority = priority;
        console.log('===============',newPriority);

        // Update the specified order's priority
        await connection.query('UPDATE orders SET priority = ? WHERE id = ?', [newPriority, id]);

        // Update the priorities of all orders that have a lower priority
        if (newPriority > currentPriority) {
            await connection.query('UPDATE orders SET priority = priority - 1 WHERE priority > ? AND priority <= ? and id != ?', [currentPriority, newPriority, id]);
        } else if (newPriority < currentPriority) {
            await connection.query('UPDATE orders SET priority = priority + 1 WHERE priority < ? AND priority >= ? and id != ?', [currentPriority, newPriority, id]);
        }

        await connection.commit();
        connection.release();

        res.status(200).json({ message: 'Priority updated successfully' });
    } catch (error) {
        console.error('Error updating priority:', error);
        if (connection) {
            await connection.rollback();
            connection.release();
        }
        res.status(500).json({ error: error.message });
    }
};



exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM orders WHERE id = ?';
        const [result] = await pool.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Order with id ${id} not found` });
        }

        res.status(200).json({ message: `Order with id ${id} deleted successfully` });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.filterProductsByFirm = async (req, res) => {
    try {
        const { firmName } = req.params;
        const query = 'SELECT * FROM orders WHERE firm_name = ? ORDER BY priority ASC';
        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Execute the query
        const [results] = await connection.query(query, [status]);

        // Release the connection back to the pool
        connection.release();
        if (results.length === 0) {
            return res.status(404).json({ error: `No orders found for firm: ${firmName}` });
        }
        res.status(200).json({ orders: results, count: results.length });
    } catch (error) {
        console.error('Error fetching orders by firm:', error);
        res.status(500).json({ error: error.message });
    }

};


exports.fetchOrdersByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const query = 'Select * from orders WHERE orders.order_status = ? ORDER BY orders.priority ASC'
        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Execute the query
        const [results] = await connection.query(query, [status]);

        // Release the connection back to the pool
        connection.release();
        if (results.length === 0) {
            return res.status(404).json({ error: `No orders found with status: ${status}` });
        }
        res.status(200).json({ orders: results, count: results.length });
    } catch (error) {
        console.error('Error fetching orders by status:', error);
        res.status(500).json({ error: error.message });
    }
};


exports.filteredOrders = async (req, res) => {
    try {
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

        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Execute the query
        const [results] = await connection.query(query, [`%${search}%`]);

        // Release the connection back to the pool
        connection.release();

        if (results.length === 0) {
            return res.status(404).json({ message: 'No orders found with this attribute and search term' });
        }

        res.status(200).json({ orders: results });
    } catch (error) {
        console.error('Error filtering orders:', error);
        res.status(500).json({ error: error.message });
    }
};


exports.getNewOrderDetails = async (req, res) => {
    try {
        const query = 'SELECT MAX(CAST(SUBSTRING(case_no, 5) AS UNSIGNED)) AS highest_case_number FROM orders';
        const [rows, fields] = await pool.query(query);

        const highestCaseNumber = rows[0].highest_case_number + 1 || 0;
        // const priority = highestCaseNumber ;

        res.status(200).json({ highestCaseNumber });
    } catch (error) {
        console.error('Error fetching new order details:', error);
        res.status(500).json({ error: error.message });
    }
};


exports.getAllResellers = async (req, res) => {

    try {
        const query = 'SELECT name FROM resellers ORDER BY name ASC';
        // Get a connection from the pool
        const connection = await pool.getConnection();
        // Execute the query
        const [results] = await connection.query(query);
        // Release the connection back to the pool
        connection.release();
        const firmNames = results.map(result => result.name);
        // Send the product names in the desired format
        res.status(200).json({ firmNames });

    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: error.message });
    }
};


exports.getOrderLogs = async (req, res) => {
    try {
        const query = 'SELECT * from order_logs';
        const connection = await pool.getConnection();
        const [rows] = await connection.query(query);
        connection.release();
        res.status(200).json(rows)
    } catch (error) {
        console.error('Error fetching logs', error);
        res.status(500).json({ error: error.message })
    }
}


// exports.getNewOrdersCount = async(req, res) =>{
//     try {
//         const query = 'select COUNT(*) AS newOrderCount from orders where is_new = "yes"';
//         const connection = await pool.getConnection();
//         const [results] = await connection.query(query);
//         connection.release();
//         res.status(200).json({orders: results})
//     } catch (error) {
//         console.error('Error fetching orders:', error);
//         res.status(500).json({error: error.message})
//     }
// }


exports.getNewOrdersCount = async (req, res) => {
    try {
        const userId = req.user.userId;
        const query = 'SELECT new_orders_count FROM user_new_orders WHERE user_id = ?';
        const [result] = await pool.query(query, [userId]);
        // const newOrdersCount = result[0]?.new_orders_count || 0; // If no count found, default to 0
        const newOrdersCount = (result[0] && result[0].new_orders_count) || 0;

        res.status(200).json({ orders: result });
    } catch (error) {
        console.error('Error fetching new orders count:', error);
        res.status(500).json({ error: error.message });
    }
};


// exports.getNewOrders = async(req, res) =>{
//     try {
//         const query = 'select * from orders where is_new = "yes" ';
//         const connection = await pool.getConnection();
//         const [results] = await connection.query(query);
//         connection.release();
//         res.status(200).json({orders: results})
//     } catch (error) {
//         console.error('Error fetching orders', error);
//         res.status(500).json({error: error.message})
//     }
// }

exports.getNewOrders = async (req, res) => {
    try {
        const user_id = req.user.userId;

        // Fetch order IDs for the logged-in user
        const getOrderIdsQuery = 'SELECT order_ids FROM user_new_orders WHERE user_id = ?';
        const [orderIdsResult] = await pool.query(getOrderIdsQuery, [user_id]);
        const orderIds = JSON.parse(orderIdsResult[0].order_ids || '[]');

        if (orderIds.length === 0) {
            return res.status(200).json({ orders: [] }); // No new orders
        }

        // Fetch order details corresponding to order IDs
        const placeholders = orderIds.map(() => '?').join(',');
        const getOrdersQuery = `SELECT * FROM orders WHERE id IN (${placeholders})`;
        const [orders] = await pool.query(getOrdersQuery, orderIds);

        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching new orders:', error);
        res.status(500).json({ error: error.message });
    }
};


// exports.resetNewOrders = async (req, res) => {
//     try {
//         const updateQuery = 'UPDATE orders SET is_new = "no" WHERE is_new = "yes"';
//         const connection = await pool.getConnection();
//         const [result] = await connection.query(updateQuery);
//         connection.release();
//         res.status(200).json({ message: 'New orders reset successfully' });
//     } catch (error) {
//         console.error('Error resetting new orders:', error);
//         res.status(500).json({ error: error.message });
//     }
// };


exports.resetNewOrders = async (req, res) => {
    try {
        const user_id = req.user.userId;

        // Update new orders count to zero
        const updateCountQuery = 'UPDATE user_new_orders SET new_orders_count = 0 WHERE user_id = ?';
        await pool.query(updateCountQuery, [user_id]);

        // Empty order_ids array
        const emptyOrderIdsQuery = 'UPDATE user_new_orders SET order_ids = JSON_ARRAY() WHERE user_id = ?';
        await pool.query(emptyOrderIdsQuery, [user_id]);

        res.status(200).json({ message: 'New orders reset successfully' });
    } catch (error) {
        console.error('Error resetting new orders:', error);
        res.status(500).json({ error: error.message });
    }
};









