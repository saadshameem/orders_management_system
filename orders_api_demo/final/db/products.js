// Import necessary controller functions
const { deleteProduct } = require("../controllers/orders");
const db = require("./connection");

class Products {
  constructor(name) {
    this.name = name;
  }

  // Method to save a new product to the database
  async save() {
    try {
      const result = await db.execute("INSERT INTO users (name) VALUES (?)", [
        this.name,
      ]);
      return result.affectedRows; // Return the number of affected rows
    } catch (error) {
      console.error("Error saving user:", error);
      throw error; // Re-throw the error to be handled by the calling function
    }
  }

  // Static method to fetch all products from the database
  static fetchAllProducts() {
    return db.execute("SELECT name FROM products ORDER BY id ASC");
  }

  // Static method to delete a product from the database by name
  static deleteProduct(name) {
    const result = db.execute("DELETE FROM products WHERE name = ?", [name]);
    return result.affectedRows;
  }

  // Static method to check if a product exists in the database
  static checkProductExist(name) {
    const result = db.execute("SELECT * FROM products WHERE name = ?", [name]);
    return result[0];
  }

  // Static method to add a new product to the database
  static addNewProduct(name) {
    const result = db.execute("INSERT INTO products (name) VALUES (?)", [name]);
    return result.affectedRows;
  }

  // Static method to fetch the ID of a sales person by name
  static fetchSalesPersonId(name) {
    const result = db.execute("SELECT id FROM sales_persons WHERE name = ?", [
      name,
    ]);
    return result;
  }

  // Static method to fetch the ID of a product by name
  static getProductId(name) {
    return db.execute("SELECT id FROM products WHERE name = ?", [name]);
  }
}

module.exports = Products;
