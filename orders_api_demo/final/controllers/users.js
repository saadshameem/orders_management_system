
const mysql2 = require('mysql2');
const dbConfig = require('../db/connect'); // Import database connection configuration
const pool = require('../db/connect');
const fs = require('fs')
const path = require('path')



exports.getAllUsers = (req, res) => {
    const query = 'SELECT * FROM users ORDER BY id ASC';
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
                console.error('Error fetching users:', error);
                res.status(500).json({ error: 'Internal server error' });               
                 return;
            }
            res.status(200).json({ users: results });
        });
    });
};

exports.getAllSalesPersons = (req, res) => {
    const query = 'SELECT name FROM sales_person ORDER BY id ASC';
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
                console.error('Error fetching sales persons:', error);
                res.status(500).json({ error: 'Internal server error' });               
                 return;
            }
            const salesPersons = results.map(result => result.name);
            // Send the product names in the desired format
            res.status(200).json({ salesPersons });
        });
    });
};

exports.addNewSalesPerson = (req, res) => {
    // Extract product name from the request body
    const {id, name } = req.body;

    // Check if the product name is provided
    if (!name) {
        return res.status(400).json({ error: ' Name is required' });
    }

    // SQL query to insert a new product into the database
    const query = 'INSERT INTO sales_person (id,name) VALUES (?,?)';

    // Execute the query with the provided product name
    pool.query(query, [id,name], (error, results) => {
        if (error) {
            console.error('Error adding product:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Return a success response with the ID of the newly added product
        res.status(201).json({ message: 'Sales Person added successfully', salesPersonId: results.insertId });
    });
};

exports.deleteUser = (req, res) => {
    const {id} = req.params;
    const query = 'delete from users where id = ?';
    pool.getConnection((err, connection) =>{
        if(err){
            console.log('Error getting database connection', err);
            res.status(500).json({error: 'Internal server error'})
            return;
        }
        connection.query(query, [id], (error, result)=>{
            connection.release();
            if(error){
                console.log('Error deleting user:', error);
                res.status(500).json({error: 'Internal server error'})
                return;
            }
            if(result.affectedRows === 0){
                return res.status(404).json({error: `User with id: ${id} not found`})
            }
            res.status(200).json({message: `User with id: ${id} deleted successfully`})
        })

    })
}