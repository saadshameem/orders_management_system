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
        type: DataTypes.ENUM('Piezometer', 'CEMS', 'AQMS', 'Flow Meter', 'Water Analyzer', 'Multi Gas Analyzer'),
        defaultValue: 'Piezometer',
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
    customer_phone_no:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    sales_person: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sales_person_id: {
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
    deadline_date: {
        type: DataTypes.DATEONLY, // Use DATEONLY to store only the date without time
        allowNull: true, // Adjust as needed based on your requirements
        get() {
            const rawValue = this.getDataValue('deadline_date');
            // Check if the date is not null
            if (rawValue) {
                // Format the date to the desired format (e.g., 'Mar 03, 2024')
                return rawValue.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
            } else {
                return null;
            }
        }
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
