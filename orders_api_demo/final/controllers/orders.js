const Order = require('../models/Order'); // Assuming your model file is named 'Order'
const sequelize = require('../db/connect'); // Import Sequelize instance
const {Op}  = require('sequelize')


exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
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
    res.status(204).end();
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