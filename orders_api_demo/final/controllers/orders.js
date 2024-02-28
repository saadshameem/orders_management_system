
const Order = require('../models/Order')
const asyncWrapper = require('../middleware/async')
const { createCustomError } = require('../errors/custom-error')

// const getAllOrders = asyncWrapper(async (req, res) => {
//   const orders = await Order.find({createdBy: req.user.userId}).sort({priority: 'asc'})
//   res.status(200).json({ orders })
// })



const getAllOrders = asyncWrapper(async (req, res) => {
  
  try {
    let query = {};

  if (req.query.firm_name) {
      query.firm_name = req.query.firm_name;
  }
  
  const orders = await Order.find({}).sort({ priority: 'asc' });
  res.status(200).json({ orders, count: orders.length });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





const filterProductsByFirm = asyncWrapper(async (req, res) => {
  const { firmName } = req.params;

  // Query the database to find orders with the specified firm name
  const orders = await Order.find({ firm_name: firmName }).sort({ priority: 'asc' });

  if (!orders || orders.length === 0) {
    return res.status(404).json({ error: `No orders found for firm: ${firmName}` });
  }

  res.status(200).json({ orders, count: orders.length });
});






// New controller function to fetch orders by status
const fetchOrdersByStatus = asyncWrapper(async (req, res, next) => {
  const { params: { status }, user: { userId } } = req;
  const orders = await Order.find({ order_status: status}).sort({ priority: 'asc' });

  if (!orders) {
    return next(createCustomError(`No orders found with status: ${status}`, 404));
  }

  res.status(200).json({ orders, count: orders.length });
});





const piechart = asyncWrapper(async (req, res) => {
  const statusSummary = await Order.aggregate([
    { $group: { _id: '$order_status', count: { $sum: 1 } } }
  ]);

  const summaryData = {};
  statusSummary.forEach(item => {
    summaryData[item._id] = item.count;
  });

  res.json(summaryData);
});




// const filterProductsByFirm = asyncWrapper(async (req, res, next) => {
//   const { query: { firmName }, user: { userId } } = req;
//   const orders = await Order.find({ firm_name: firmName}).sort({ priority: 'asc' });

//   if (!orders) {
//     return next(createCustomError(`No orders found with firm name: ${firmName}`, 404));
//   }

//   res.status(200).json({ orders, count: orders.length });
// });




const createOrder = asyncWrapper(async (req, res) => {
  // req.body.createdBy = req.user.userId
  const order = await Order.create(req.body)
  res.status(201).json({ order })
})




const getOrder = asyncWrapper(async (req, res, next) => {
  const {user:{userId}, params:{id:orderID}} = req

  const order = await Order.findOne({ _id: orderID  })
  if (!order) {
    return next(createCustomError(`No order with id : ${orderID}`, 404))
  }

  res.status(200).json({ orders:order })
})





const deleteOrder = asyncWrapper(async (req, res, next) => {
  const {
    user:{userId}, 
    params:{id:orderID}
} = req

  const order = await Order.findByIdAndRemove({
    _id:orderID
})
  if (!order) {
    return next(createCustomError(`No order with id : ${orderID}`, 404))
  }
  res.status(200).json({ order })
})





const updateOrder = asyncWrapper(async (req, res, next) => {
  const {
    
    user:{userId}, 
    params:{id:orderID}
} = req

  const order = await Order.findByIdAndUpdate(
    {_id:orderID }, 
    req.body, 
    {new:true, runValidators:true}
)

  if (!order) {
    return next(createCustomError(`No order with id : ${orderID}`, 404))
  }

  res.status(200).json({ order })
})





module.exports = {
  getAllOrders,
  createOrder,
  getOrder,
  updateOrder,
  deleteOrder,
  fetchOrdersByStatus,
  filterProductsByFirm,
  piechart

}
