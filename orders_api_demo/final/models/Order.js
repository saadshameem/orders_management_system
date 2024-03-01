const { DataTypes } = require('sequelize');
const sequelize = require('../db/connect'); // Import Sequelize instance
const { date } = require('joi');

const Order = sequelize.define('Order', {
    case_no: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    po_no: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    product_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 50], // Max length validation
        },
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 50], // Max length validation
        },
    },
    firm_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 200], // Max length validation
        },
    },
    customer_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 50], // Max length validation
        },
    },
    sales_person: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    order_status: {
        type: DataTypes.ENUM('Trading', 'Pending', 'In Production', 'Testing', 'Packed', 'Shipped'),
        defaultValue: 'Pending',
    },
    payment_status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 50], // Max length validation
        },
    },
    priority: {
        type: DataTypes.INTEGER,
    },
    
}, 
{
    timestamps: true, // Automatically add createdAt and updatedAt fields
}
);

module.exports = Order;
