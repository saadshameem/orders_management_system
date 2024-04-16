
const mysql2 = require('mysql2');
const dbConfig = require('../db/connect'); // Import database connection configuration
const pool = require('../db/connect');
const fs = require('fs')
const path = require('path')



exports.getAllUsers = async (req, res) => {

    try {
        const query = 'SELECT * FROM users ORDER BY id ASC';
        // Get a connection from the pool
        const connection = await pool.getConnection();
        // Execute the query
        const [results] = await connection.query(query);
        // Release the connection back to the pool
        connection.release();

        res.status(200).json({ users: results });
    } catch (error) {
        console.error('Error fetching persons:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM users WHERE id = ?';

        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Execute the query
        const [result] = await connection.query(query, [id]);

        // Release the connection back to the pool
        connection.release();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `User with id: ${id} not found` });
        }

        res.status(200).json({ message: `User with id: ${id} deleted successfully` });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: error.message });
    }
};



exports.getAllSalesPersons = async (req, res) => {

    try {
        const query = 'SELECT * FROM sales_persons ORDER BY id ASC';
        // Get a connection from the pool
        const connection = await pool.getConnection();
        // Execute the query
        const [results] = await connection.query(query);
        // Release the connection back to the pool
        connection.release();

        res.status(200).json({ salesPersons: results });

    } catch (error) {
        console.error('Error fetching persons:', error);
        res.status(500).json({ error: error.message });
    }
};


exports.getSalesPerson = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM sales_persons WHERE id = ?';

        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Execute the query
        const [results] = await connection.query(query, [id]);

        // Release the connection back to the pool
        connection.release();

        if (results.length === 0) {
            return res.status(404).json({ error: `Person with id ${id} not found` });
        }

        res.status(200).json({ order: results[0] });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: error.message });
    }
};



exports.addNewSalesPerson = async (req, res) => {
    try {
        // Extract sales person details from the request body
        const { id, name } = req.body;

        // Check if the name is provided
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        // Check if the sales person already exists
        const checkUserQuery = `SELECT * FROM sales_persons WHERE name = ?`;
        const [existingSalesPersons] = await pool.query(checkUserQuery, [name]);
        if (existingSalesPersons.length > 0) {
            return res.status(400).json({ message: 'Person already exists' });
        }

        // SQL query to insert a new sales person into the database
        const insertQuery = 'INSERT INTO sales_persons (id, name) VALUES (?, ?)';

        // Execute the query to add the new sales person
        const [results] = await pool.query(insertQuery, [id, name]);

        // Return a success response with the ID of the newly added sales person
        res.status(201).json({ message: 'Sales Person added successfully', salesPersonId: results.insertId });
    } catch (error) {
        console.error('Error adding sales person:', error);
        res.status(500).json({ error: error.message });
    }
};



exports.deleteSalesPerson = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM sales_persons WHERE id = ?';
        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Execute the query
        const [result] = await connection.query(query, [id]);

        // Release the connection back to the pool
        connection.release();
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Person with id ${id} not found` });
        }
        res.status(200).json({ message: `Person with id ${id} deleted successfully` });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: error.message });
    }

};

exports.updateSalesPersonName = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        // Check if the new name is provided
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        // SQL query to update the name of the sales person
        const query = 'UPDATE sales_persons SET name = ? WHERE id = ?';

        // Execute the query to update the name
        const [result] = await pool.query(query, [name, id]);

        // Check if the sales person with the given ID exists
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Sales person with id ${id} not found` });
        }

        // Return a success response
        res.status(200).json({ message: `Sales person name with id ${id}  updated successfully` });
    } catch (error) {
        console.error('Error updating sales person name:', error);
        res.status(500).json({ error: error.message });
    }
};
