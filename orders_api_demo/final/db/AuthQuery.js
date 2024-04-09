const db = require("./connection");

class User {
  constructor(name, email, password, role) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

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

  static async checkUser(email) {
    try {
      const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      return rows; // Return the fetched rows
    } catch (error) {
      console.error("Error checking user:", error);
      throw error; // Re-throw the error to be handled by the calling function
    }
  }
}

module.exports = User;
