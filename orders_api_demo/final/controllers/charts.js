const mysql2 = require('mysql2');
const dbConfig = require('../db/connect'); // Import database connection configuration
const pool = require('../db/connect');
const fs = require('fs')
const path = require('path')


exports.piechart = async (req, res) => {
    try {
        const query = 'SELECT order_status, COUNT(*) AS count FROM orders GROUP BY order_status';

        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Execute the query
        const [results] = await connection.query(query);

        // Release the connection back to the pool
        connection.release();

        const summaryData = {};
        results.forEach(item => {
            summaryData[item.order_status] = item.count;
        });

        res.json(summaryData);
    } catch (error) {
        console.error('Error fetching pie chart data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.productPiechart = async (req, res) => {
    try {
        const query = 'SELECT product_name, COUNT(*) AS count FROM orders GROUP BY product_name';

        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Execute the query
        const [results] = await connection.query(query);

        // Release the connection back to the pool
        connection.release();

        const summaryData = {};
        results.forEach(item => {
            summaryData[item.product_name] = item.count;
        });

        res.json(summaryData);
    } catch (error) {
        console.error('Error fetching product pie chart data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.salesPiechart = async (req, res) => {
    try {
        const { year, month } = req.query;
        const query = `
            SELECT sales_person, SUM(CAST(SUBSTRING_INDEX(price, ".", -1) AS DECIMAL(10,2)) * 1) AS total_amount
            FROM orders
            WHERE YEAR(createdAt) = ? AND MONTH(createdAt) = ?
            GROUP BY sales_person
        `;

        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Execute the query
        const [results] = await connection.query(query, [year, month]);

        // Release the connection back to the pool
        connection.release();

        const summaryData = {};
        results.forEach(item => {
            summaryData[item.sales_person] = item.total_amount;
        });

        res.json(summaryData);
    } catch (error) {
        console.error('Error fetching sales pie chart data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.getOrderStatisticsMonthly = async (req, res) => {
    try {
        const startDate = new Date(new Date().getFullYear(), 0, 1); // Start of the current year
        const endDate = new Date(new Date().getFullYear() + 1, 0, 1); // Start of the next year
        const query = `
            SELECT
                MONTH(createdAt) AS month,
                SUM(CASE WHEN order_status = 'shipped' THEN 1 ELSE 0 END) AS shippedCount,
                COUNT(*) AS receivedCount
            FROM orders
            WHERE createdAt BETWEEN ? AND ?
            GROUP BY MONTH(createdAt)
        `;

        // Get a connection from the pool
        const connection = await pool.getConnection();

        // Execute the query
        const [results] = await connection.query(query, [startDate, endDate]);

        // Release the connection back to the pool
        connection.release();

        const monthlyData = [];
        for (let i = 1; i <= 12; i++) {
            const monthData = results.find(stat => stat.month === i) || { month: i, receivedCount: 0, shippedCount: 0 };
            monthlyData.push(monthData);
        }

        res.status(200).json({ monthlyData });
    } catch (error) {
        console.error('Error fetching order statistics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.getOrderStatisticsDaily = async (req, res) => {

    try {
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
            FROM orders
            WHERE createdAt BETWEEN ? AND ?
            GROUP BY DATE(createdAt)
        `;

        // Get a connection from the pool
        const connection = await pool.getConnection();
        // Execute the query
        const [results] = await connection.query(query, [startDate, endDate]);

        // Release the connection back to the pool
        connection.release();

        const formattedData = dateArray.map(date => {
            const matchingData = results.find(stat => new Date(stat.date).toDateString() === date.toDateString());
            return {
                date: date.toDateString(),
                receivedCount: matchingData ? matchingData.receivedCount : 0,
                shippedCount: matchingData ? matchingData.shippedCount : 0
            };
        });
        res.status(200).json({ orderStats: formattedData });
    } catch (error) {
        console.error('Error fetching order statistics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};