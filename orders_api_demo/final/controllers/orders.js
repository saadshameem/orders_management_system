const Order = require('../models/Order'); // Assuming your model file is named 'Order'
const sequelize = require('../db/connect'); // Import Sequelize instance
const { Op } = require('sequelize')


exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [['priority', 'ASC']]
    })
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createOrder = async (req, res) => {

  try {
    const order = await Order.create(req.body);
    res.status(201).json({ order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: `Order with id ${id} not found` });
    }
    res.status(200).json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  console.log(id)
  try {
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: `Order with id ${id} not found` });
    }
    console.log("req.body: ", req.body)
    await order.update(req.body);
    res.status(200).json({ order });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: `Order with id ${id} not found` });
    }
    await order.destroy();
    res.status(200).json({ message: `Order with id ${id} deleted successfully` });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.filterProductsByFirm = async (req, res) => {
  const { firmName } = req.params;

  try {
    const orders = await Order.findAll({
      where: { firm_name: firmName },
      order: [['priority', 'ASC']]
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: `No orders found for firm: ${firmName}` });
    }

    res.status(200).json({ orders, count: orders.length });
  } catch (error) {
    console.error('Error fetching orders by firm:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.fetchOrdersByStatus = async (req, res) => {
  const { params: { status } } = req;

  // Query the database to find orders with the specified status
  const orders = await Order.findAll({ where: { order_status: status } });

  // Check if any orders were found
  if (!orders || orders.length === 0) {
    return res.status(404).json({ error: `No orders found with status: ${status}` });
  }

  // Return the found orders
  res.status(200).json({ orders, count: orders.length });
};



exports.piechart = async (req, res) => {
  try {
    const statusSummary = await Order.findAll({
      attributes: ['order_status', [sequelize.fn('COUNT', sequelize.col('*')), 'count']],
      group: ['order_status']
    });

    const summaryData = {};
    statusSummary.forEach(item => {
      summaryData[item.order_status] = item.get('count');
    });

    res.json(summaryData);
  } catch (error) {
    console.error('Error fetching pie chart data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.productPiechart = async (req, res) => {
  try {
    const productNameStats = await Order.findAll({
      attributes: ['product_name', [sequelize.fn('COUNT', sequelize.col('*')), 'count']],
      group: ['product_name']
    });

    const summaryData = {};
    productNameStats.forEach(item => {
      summaryData[item.product_name] = item.get('count');
    });

    res.json(summaryData);
  } catch (error) {
    console.error('Error fetching pie chart data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.filteredOrders = async (req, res) => {
  const { attribute, search } = req.query;

  try {
    let filteredOrders;

    switch (attribute) {
      case 'case_no':
      case 'product_name':
      case 'firm_name':
      case 'sales_person':
        filteredOrders = await Order.findAll({
          where: {
            [attribute]: {
              [Op.like]: `%${search}%`
            }
          }
        });
        break;
      default:
        return res.status(400).json({ error: 'Invalid filter attribute' });
    }
    if (filteredOrders.length === 0) {
      return res.status(404).json({ message: 'No orders found with this attribute and search term' });
    }

    res.status(200).json({ orders: filteredOrders });
  } catch (error) {
    console.error('Error filtering orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Controller code to fetch monthly order statistics
exports.getOrderStatisticsMonthly = async (req, res) => {
  try {
    // Get the start and end dates for the current year
    const startDate = new Date(new Date().getFullYear(), 0, 1); // Start of the current year
    const endDate = new Date(new Date().getFullYear() + 1, 0, 1); // Start of the next year

    // Aggregate order statistics for each month of the year
    const orderStats = await Order.findAll({
      attributes: [
        [sequelize.literal('MONTH(createdAt)'), 'month'],
        [sequelize.literal('SUM(CASE WHEN order_status = "shipped" THEN 1 ELSE 0 END)'), 'shippedCount'],
        [sequelize.literal('COUNT(*)'), 'receivedCount']
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      },
      group: sequelize.literal('MONTH(createdAt)'),
      raw: true
    });

    // Create an array of objects representing each month with received and shipped counts
    const monthlyData = [];
    for (let i = 1; i <= 12; i++) {
      const monthData = orderStats.find(stat => parseInt(stat.month) === i) || { month: i, receivedCount: 0, shippedCount: 0 };
      monthlyData.push(monthData);
    }

    res.status(200).json({ monthlyData });
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// Controller code to fetch daily order statistics
exports.getOrderStatisticsDaily = async (req, res) => {
  try {
    // Calculate start and end dates for the past 7 days
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 14); // Start date is 7 days ago

    // Create an array of all dates for the past 7 days
    const dateArray = [];
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      dateArray.push(new Date(date));
    }

    // Aggregate order statistics for each day of the past week
    const orderStats = await Order.findAll({
      attributes: [
        [sequelize.literal('DATE(createdAt)'), 'date'],
        [sequelize.literal('SUM(CASE WHEN order_status = "shipped" THEN 1 ELSE 0 END)'), 'shippedCount'],
        [sequelize.literal('COUNT(*)'), 'receivedCount']
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      },
      group: sequelize.literal('DATE(createdAt)'),
      raw: true
    });

    // Ensure that the response contains data for all dates of the past 7 days
    const formattedData = dateArray.map(date => {
      const matchingData = orderStats.find(stat => new Date(stat.date).toDateString() === date.toDateString());
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
