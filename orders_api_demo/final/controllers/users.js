
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
                res.status(500).json({ error: error.message });               
                 return;
            }
            res.status(200).json({ users: results });
        });
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
                res.status(500).json({error: error.message})
                return;
            }
            if(result.affectedRows === 0){
                return res.status(404).json({error: `User with id: ${id} not found`})
            }
            res.status(200).json({message: `User with id: ${id} deleted successfully`})
        })

    })
}


exports.getAllSalesPersons = (req, res) => {
    const query = 'SELECT * FROM sales_persons ORDER BY id ASC';
    // Get a connection from the pool
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        // Execute the query
        connection.query(query, (error, results) => {
            // Release the connection back to the pool
            connection.release();
            if (error) {
                console.error('Error fetching sales persons:', error);
                res.status(500).json({ error: error.message });               
                 return;
            }
            // const salesPersons = results.map(result =>({name: result.name, id:result.id}));
            // // Send the product names in the desired format
            // res.status(200).json({ salesPersons });
            res.status(200).json({ salesPersons: results });

        });
    });
};



exports.getSalesPerson = (req, res) => {
    const { name } = req.params;
    const query = 'SELECT * FROM sales_persons WHERE name = ?';
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).json({ error: err.message  });
            return;
        }
        connection.query(query, [name], (error, results) => {
            connection.release();
            if (error) {
                console.error('Error fetching order:', error);
                res.status(500).json({ error: error.message  });
                return;
            }
            if (results.length === 0) {
                return res.status(404).json({ error: `Person with name ${name} not found` });
            }
            res.status(200).json({ order: results[0] });
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

    const checkUserQuery = `SELECT * FROM sales_persons WHERE name = ?`;
    pool.query(checkUserQuery, [name], async (error, results) => {
        if (error) {
            console.error('Error checking user:', error);
            res.status(500).json({ message: error.message });
            return;
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'Person already exists' });
        }

    // SQL query to insert a new product into the database
    const query = 'INSERT INTO sales_persons (id,name) VALUES (?,?)';

    // Execute the query with the provided product name
    pool.query(query, [id,name], (error, results) => {
        if (error) {
            console.error('Error adding product:', error);
            return res.status(500).json({ error: error.message });
        }

        // Return a success response with the ID of the newly added product
        res.status(201).json({ message: 'Sales Person added successfully', salesPersonId: results.insertId });
    });
});

};


exports.deleteSalesPerson = (req, res) => {
    const { name } = req.params;
    const query = 'DELETE FROM sales_persons WHERE name = ?';
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        connection.query(query, [name], (error, result) => {
            connection.release();
            if (error) {
                console.error('Error deleting product:', error);
                res.status(500).json({ error: error.message });
                return;
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: `Person with name ${name} not found` });
            }
            res.status(200).json({ message: `Person with name ${name} deleted successfully` });
        });
    });
  };

