// Import the database connection
const db = require("./connection");

// Define the User class to interact with the 'users' table
class User {
  // Constructor to initialize user details
  constructor(name, email, password, role) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  // Method to save the user details into the database
  async save() {
    try {
      const result = await db.execute(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [this.name, this.email, this.password, this.role]
      );
      return result[0].affectedRows; // Return the number of affected rows
    } catch (error) {
      console.error("Error saving user:", error);
      throw error; // Re-throw the error to be handled by the calling function
    }
  }

  // Static method to check if a user with a specific email exists in the database
  static async checkUser(email) {
    try {
      const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      return rows; // Return the fetched rows (user data)
    } catch (error) {
      console.error("Error checking user:", error);
      throw error; // Re-throw the error to be handled by the calling function
    }
  }

  static async selectUser(userId) {
    return db.execute("SELECT id, name, role FROM users WHERE id = ?", [
      userId,
    ]);
  }

  static getAllUsers() {
    return db.execute("SELECT * FROM users ORDER BY id ASC");
  }

  static getSalesPersonName() {
    return db.execute("SELECT name FROM sales_persons ORDER BY id ASC");
  }

  static getSalesPerson(name) {
    return db.execute("SELECT * FROM sales_persons WHERE name = ?", [name]);
  }
  static deleteUser(id) {
    return db.execute("DELETE from users where id = ?", [id]);
  }

  static updateUser(id, name) {
    return db.execute("UPDATE sales_persons SET name = ? WHERE id = ?", [
      name,
      id,
    ]);
  }
}

// Export the User class
module.exports = User;
