
const Order = require('../models/Order')
const asyncWrapper = require('../middleware/async')
const { createCustomError } = require('../errors/custom-error')

// const getAllOrders = asyncWrapper(async (req, res) => {
//   const orders = await Order.find({createdBy: req.user.userId}).sort({priority: 'asc'})
//   res.status(200).json({ orders })
// })

// const getAllOrders = asyncWrapper(async (req, res) => {
//   let query = {};
//   if (req.query.status) {
//     query.order_status = req.query.status;
//   }
//   const orders = await Order.find({createdBy: req.user.userId}).sort({ priority: 'asc' });
//   res.status(200).json({ orders, count: orders.length });
// });

const getAllOrders = asyncWrapper(async (req, res) => {
  
  try {
    let query = {};

  // Check if status or firm_name query parameters are provided
  // if (req.query.status) {
  //     query.order_status = req.query.status;
  // }
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


// New controller function to fetch orders by status
const fetchOrdersByStatus = asyncWrapper(async (req, res, next) => {
  const { params: { status }, user: { userId } } = req;
  const orders = await Order.find({ order_status: status}).sort({ priority: 'asc' });

  if (!orders) {
    return next(createCustomError(`No orders found with status: ${status}`, 404));
  }

  res.status(200).json({ orders, count: orders.length });
});




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
  fetchOrdersByStatus

}
