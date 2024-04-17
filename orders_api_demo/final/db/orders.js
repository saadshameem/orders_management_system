// Import the database connection
const db = require("./connection");

// Define the Orders class to interact with the 'orders' table
class Orders {
  // Constructor to initialize order details
  constructor(
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
    deadline_date,
    priority,
    image,
    sales_person_id
  ) {
    this.case_no = case_no;
    this.po_no = po_no;
    this.product_name = product_name;
    this.price = price;
    this.quantity = quantity;
    this.firm_name = firm_name;
    this.customer_name = customer_name;
    this.customer_phone_no = customer_phone_no;
    this.sales_person = sales_person;
    this.order_status = order_status;
    this.payment_status = payment_status;
    this.deadline_date = deadline_date;
    this.priority = priority;
    this.image = image;
    this.sales_person_id = sales_person_id;
  }

  // Method to save the order details into the database
  async save() {
    try {
      const result = await db.execute(
        "INSERT INTO orders (case_no, po_no, product_name, price, quantity, firm_name, customer_name, customer_phone_no, sales_person, order_status, payment_status, deadline_date, priority, image, sales_person_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          this.case_no,
          this.po_no,
          this.product_name,
          this.price,
          this.quantity,
          this.firm_name,
          this.customer_name,
          this.customer_phone_no,
          this.sales_person,
          this.order_status,
          this.payment_status,
          this.deadline_date,
          this.priority,
          this.image,
          this.sales_person_id,
        ]
      );
      return result[0].affectedRows; // Return the number of affected rows
    } catch (error) {
      console.error("Error saving order:", error);
      throw error; // Re-throw the error to be handled by the calling function
    }
  }

  // Static method to find the count of orders by order status
  static findOrderCount() {
    return db.execute(
      "SELECT order_status, COUNT(*) AS count FROM orders GROUP BY order_status"
    );
  }

  // Static method to find the count of products by product name
  static findProductCount() {
    return db.execute(
      "SELECT product_name, COUNT(*) AS count FROM orders GROUP BY product_name"
    );
  }

  // Static method to retrieve sales pie chart details for a specific year and month
  static salesPiechartDetails(year, month) {
    return db.execute(
      `
      SELECT sales_person, 
             SUM(CAST(SUBSTRING_INDEX(price, '.', -1) AS DECIMAL(10,2)) * quantity) AS total_amount 
      FROM orders 
      WHERE YEAR(createdAt) = ? AND MONTH(createdAt) = ? 
      GROUP BY sales_person
      `,
      [year, month]
    );
  }

  // Static method to retrieve monthly order statistics within a given date range
  static ordersStaticsMonthly(start, end) {
    return db.execute(
      `
      SELECT
      MONTH(createdAt) AS month,
      SUM(CASE WHEN order_status = 'shipped' THEN 1 ELSE 0 END) AS shippedCount,
      COUNT(*) AS receivedCount
      FROM orders
      WHERE createdAt BETWEEN ? AND ?
      GROUP BY MONTH(createdAt)
      `,
      [start, end]
    );
  }

  // Static method to retrieve shipped orders count within a specific date range
  static shipedOrdersCount(startDate, endDate) {
    return db.execute(
      `
      SELECT
      DATE(createdAt) AS date,
      SUM(CASE WHEN order_status = 'shipped' THEN 1 ELSE 0 END) AS shippedCount,
      COUNT(*) AS receivedCount
      FROM orders
      WHERE createdAt BETWEEN ? AND ?
      GROUP BY DATE(createdAt)
      `,
      [startDate, endDate]
    );
  }

  // Static method to retrieve all orders from the database
  static getAllOrders() {
    return db.execute("SELECT * FROM orders ORDER BY priority ASC");
  }

  // Static method to retrieve an order by its ID
  static getOrderById(id) {
    return db.execute("SELECT * FROM orders WHERE id = ?", [id]);
  }

  // Static method to update order details in the database
  static updateOrders(
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
  ) {
    const result = db.execute(
      "UPDATE orders SET case_no = ?, po_no = ?, price = ?, quantity = ?, firm_name = ?, customer_name = ?, customer_phone_no = ?, order_status = ?, payment_status = ?, deadline_date = ?, priority = ?, image = ? WHERE id = ?",
      [
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
        id,
      ]
    );
    return result.affectedRows;
  }

  // Static method to delete an order from the database by its ID
  static deleteOrderById(id) {
    const result = db.execute("DELETE FROM orders WHERE id = ?", [id]);
    return result.affectedRows;
  }

  // Static method to filter orders by a specified attribute and search term
  static filterOrdersByAttribute(attribute, search) {
    return new Promise((resolve, reject) => {
      let query;
      switch (attribute) {
        case "case_no":
        case "product_name":
        case "firm_name":
        case "sales_person":
          query = `SELECT * FROM orders WHERE ${attribute} LIKE ?`;
          break;
        default:
          reject(new Error("Invalid filter attribute"));
          return;
      }

      db.execute(query, [`%${search}%`], (error, results) => {
        if (error) {
          console.error("Error filtering orders:", error);
          reject(error);
        } else {
          if (results.length === 0) {
            reject(
              new Error("No orders found with this attribute and search term")
            );
          } else {
            resolve(results);
          }
        }
      });
    });
  }

  // Static method to get details of the newest order
  static getNewOrderDetails() {
    return db.execute(
      "SELECT MAX(CAST(SUBSTRING(case_no, 5) AS UNSIGNED)) AS highest_case_number FROM orders"
    );
  }

  static getImagePath(id) {
    return db.execute("SELECT image FROM orders WHERE id =?", [id]);
  }
}

// Export the Orders class
module.exports = Orders;
