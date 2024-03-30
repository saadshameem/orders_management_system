
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
                console.error('Error fetching orders:', error);
                res.status(500).json({ error: 'Internal server error' });               
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