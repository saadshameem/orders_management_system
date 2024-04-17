const fs = require("fs");
const path = require("path");
const Orders = require("../db/orders");
const Products = require("../db/products");

// Controller to fetch all orders
exports.getAllOrders = async (req, res) => {
  try {
    const results = await Orders.getAllOrders();
    res.status(200).json({ orders: results[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to fetch all product names
exports.getAllProducts = async (req, res) => {
  try {
    const results = await Products.fetchAllProducts();
    const productNames = results[0].map((result) => result.name);
    res.status(200).json({ productNames });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Controller to delete a product by name
exports.deleteProduct = async (req, res) => {
  try {
    const { name } = req.params;
    const results = await Products.deleteProduct(name);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res
      .status(200)
      .json({ message: `Product with name ${name} deleted successfully` });
  } catch (error) {
    res.status(400).json(error);
  }
};

// Controller to add a new product
exports.AddNewProduct = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Product name is required" });
    }
    const results = await Products.checkProductExist(name);
    if (results.length > 0) {
      return res.status(400).json({ message: "Product already exists" });
    }
    const result = await Products.addNewProduct(name);
    if (result) {
      res.status(201).json({
        message: "Product added successfully",
        productId: results.insertId,
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Controller to create a new order
exports.createOrder = async (req, res, next) => {
  try {
    // Extract order data from req.body
    const {
      case_no,
      po_no,
      product_name,
      price,
      quantity,
      deadline_date,
      firm_name,
      customer_name,
      customer_phone_no,
      sales_person,
      order_status,
      payment_status,
      priority,
      image,
    } = req.body;

    let relativeImagePath = null;

    if (image) {
      // Remove the data:image/jpeg;base64, prefix
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const imageData = Buffer.from(base64Data, "base64");

      const imageFileName = `image_${case_no}.jpeg`;

      // Define the path where you want to save the image
      const imagePath = path.join(
        __dirname,
        "../public3/uploads/",
        imageFileName
      );

      // Save the image to the uploads directory
      fs.writeFile(imagePath, imageData, (err) => {
        if (err) {
          console.error("Error saving image:", err);
          return res.status(500).json({ error: "Failed to save image" });
        }
        console.log("Image saved successfully");
      });
      relativeImagePath = `/uploads/${imageFileName}`;
    }
    const sales_person_id = await Products.fetchSalesPersonId(sales_person);

    // Save the order data to the database
    const formattedDeadlineDate = new Date(deadline_date)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const order = new Orders(
      case_no,
      po_no,
      product_name,
      price,
      quantity,
      firm_name,
      customer_name,
      customer_phone_no,
      sales_person,
      order_status,
      payment_status,
      formattedDeadlineDate,
      priority,
      relativeImagePath,
      sales_person_id
    );
    await order.save();
    return res.status(201).json({
      message: "Order created successfully",
      orderId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Controller to fetch an order by ID
exports.getOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const results = await Orders.getOrderById(id);
    console.log(results[0]);
    if (results[0].length === 0) {
      return res.status(404).json({ error: `Order with id ${id} not found` });
    }
    res.status(200).json({ order: results[0] });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Controller to edit/update an order
exports.editOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Extract updated order data from req.body
    const {
      case_no,
      po_no,
      price,
      quantity,
      firm_name,
      customer_name,
      customer_phone_no,
      order_status,
      payment_status,
      deadline_date,
      priority,
      image,
    } = req.body;

    let relativeImagePath = null;

    if (image) {
      // Remove the data:image/jpeg;base64, prefix
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const imageData = Buffer.from(base64Data, "base64");

      const imageFileName = `image_${case_no}.jpeg`;

      // Define the path where you want to save the image
      const imagePath = path.join(
        __dirname,
        "../public3/uploads/",
        imageFileName
      );

      // Save the image to the uploads directory
      fs.writeFile(imagePath, imageData, (err) => {
        if (err) {
          console.error("Error saving image:", err);
          return res.status(500).json({ error: "Failed to save image" });
        }
        console.log("Image saved successfully");
      });
      relativeImagePath = `/uploads/${imageFileName}`;
    } else {
      relativeImagePath = await Orders.getImagePath(id);
      relativeImagePath =  path.join( __dirname,
        "../public3" + relativeImagePath
      )
    }

    const update = await Orders.updateOrders(
      case_no,
      po_no,
      price,
      quantity,
      firm_name,
      customer_name,
      customer_phone_no,
      order_status,
      payment_status,
      deadline_date,
      priority,
      relativeImagePath,
      id
    );
    if (update) {
      return res.status(200).json({ message: "Order updated successfully" });
    }
  } catch (error) {
    console.error("Error updating order:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Controller to delete an order by ID
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Orders.deleteOrderById(id);
    if (result === 0) {
      return res.status(404).json({ error: `Order with id ${id} not found` });
    }
    res
      .status(200)
      .json({ message: `Order with id ${id} deleted successfully` });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Controller to filter products by firm name
exports.filterProductsByFirm = async (req, res) => {
  try {
    const { firmName } = req.params;
    const results = await Orders.filterProductsByFirm(firmName);
    if (results[0].length === 0) {
      return res
        .status(404)
        .json({ error: `No orders found for firm: ${firmName}` });
    }
    res.status(200).json({ orders: results, count: results.length });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Controller to fetch orders by status
exports.fetchOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const results = await Orders.fetchOrderByStatus(status);
    if (results[0].length === 0) {
      return res
        .status(404)
        .json({ error: `No orders found with status: ${status}` });
    }
    res.status(200).json({ orders: results[0], count: results[0].length });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Controller to filter orders by attribute and search term
exports.filteredOrders = async (req, res) => {
  try {
    const { attribute, search } = req.query;
    const results = await Orders.filterOrdersByAttribute(attribute, search);
    if (results.length === 0) {
      return res.status(404).json({
        message: "No orders found with this attribute and search term",
      });
    }
    res.status(200).json({ orders: results });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Controller to fetch new order details
exports.getNewOrderDetails = async (req, res) => {
  try {
    const results = await Orders.getNewOrderDetails();
    const highestCaseNumber = results[0].highest_case_number || 0;
    const priority = highestCaseNumber + 1;
    res.status(200).json({ highestCaseNumber, priority });
  } catch (error) {
    res.status(500).json(error);
  }
};
