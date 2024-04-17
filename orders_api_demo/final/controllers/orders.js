


const mysql2 = require('mysql2');
const dbConfig = require('../db/connect'); // Import database connection configuration
const pool = require('../db/connect');
const fs = require('fs')
const path = require('path');
const { error } = require('console');




exports.getAllOrders = async (req, res) => {
    try {
        const query = 'SELECT * FROM orders ORDER BY priority ASC';

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
        const query = 'SELECT name FROM products ORDER BY id ASC';
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
        // Extract order data from req.body
        const { case_no, po_no, product_name, price, quantity, deadline_date, firm_name, customer_name, customer_phone_no, sales_person, order_status, payment_status, priority, remark, image } = req.body;

        let relativeImagePath = null;

        if (image) {
            // Remove the data:image/jpeg;base64, prefix
            const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
            const imageData = Buffer.from(base64Data, 'base64');

            const imageFileName = `image_${case_no}.jpeg`;

            // Define the path where you want to save the image
            const imagePath = path.join(__dirname, '../public3/uploads/', imageFileName);

            // Save the image to the uploads directory
            await fs.promises.writeFile(imagePath, imageData);

            relativeImagePath = `/uploads/${imageFileName}`;
        }

        // Fetch sales person ID based on sales person name
        const salesPersonIdQuery = 'SELECT id FROM sales_persons WHERE name = ?';
        const [salesPersonRows] = await pool.query(salesPersonIdQuery, [sales_person]);

        if (salesPersonRows.length === 0) {
            return res.status(400).json({ error: 'Sales person not found' });
        }
        const sales_person_id = salesPersonRows[0].id;

        const formattedDeadlineDate = new Date(deadline_date).toISOString().slice(0, 19).replace('T', ' ');
        const insertOrderQuery = 'INSERT INTO orders (case_no, po_no, product_name, price, quantity, deadline_date, firm_name, customer_name, customer_phone_no,  sales_person, sales_person_id, order_status, payment_status, priority, remark, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const result = await pool.query(insertOrderQuery, [case_no, po_no, product_name, price, quantity, formattedDeadlineDate, firm_name, customer_name, customer_phone_no, sales_person, sales_person_id, order_status, payment_status, priority, remark, relativeImagePath]);

        return res.status(201).json({ message: 'Order created successfully', orderId: result[0].insertId });
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ error: error.message });
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
        const { case_no, po_no, price, quantity, firm_name, customer_name, customer_phone_no, order_status, sales_person, payment_status, deadline_date, priority, remark, image } = req.body;

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

        const updateOrderQuery = 'UPDATE orders SET case_no = ?, po_no = ?, price = ?, quantity = ?, firm_name = ?, customer_name = ?, customer_phone_no = ?, order_status = ?, sales_person = ?, sales_person_id = ?, payment_status = ?, deadline_date = ?, priority = ?, remark = ?, image = ? WHERE id = ?';
        const values = [case_no, po_no, price, quantity, firm_name, customer_name, customer_phone_no, order_status, sales_person, sales_person_id, payment_status, deadline_date, priority, remark, relativeImagePath, id];

        await pool.query(updateOrderQuery, values);

        return res.status(200).json({ message: 'Order updated successfully' });
    } catch (error) {
        console.error('Error updating order:', error);
        return res.status(500).json({ error: error.message });
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


exports.filterProductsByFirm =async (req, res) => {
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
        const priority = highestCaseNumber ;

        res.status(200).json({ highestCaseNumber, priority });
    } catch (error) {
        console.error('Error fetching new order details:', error);
        res.status(500).json({ error: error.message });
    }
};
