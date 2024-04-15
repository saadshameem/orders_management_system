const db = require("./connection");

class Orders {
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

  static findOrderCount() {
    return db.execute(
      "SELECT order_status, COUNT(*) AS count FROM orders GROUP BY order_status"
    );
  }

  static findProductCount() {
    return db.execute(
      "SELECT product_name, COUNT(*) AS count FROM orders GROUP BY product_name"
    );
  }

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
}

module.exports = Orders;
