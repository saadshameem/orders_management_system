// Import the database connection
const db = require("./connection");

// Define the User class to interact with the 'users' table
class SalesPerson {
  // Constructor to initialize user details
  constructor(name) {
    this.name = name;
  }

  // Method to save the user details into the database
  async save() {
    try {
      const result = await db.execute(
        "INSERT INTO sales_person (name) VALUES (?)",
        [this.name]
      );
      return result[0].affectedRows; // Return the number of affected rows
    } catch (error) {
      console.error("Error saving user:", error);
      throw error; // Re-throw the error to be handled by the calling function
    }
  }

  static getAllSalesPersons() {
    return db.execute("SELECT * FROM sales_persons");
  }

  static getSalesPersonName() {
    return db.execute("SELECT name FROM sales_persons ORDER BY id ASC");
  }

  static getSalesPerson(name) {
    return db.execute("SELECT * FROM sales_persons WHERE name = ?", [name]);
  }
  static deletePerson(name) {
    return db.execute("DELETE FROM sales_persons WHERE name = ?", [name]);
  }
}

// Export the User class
module.exports = SalesPerson;
