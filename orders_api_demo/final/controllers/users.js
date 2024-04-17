const User = require("../db/AuthQuery");
const SalesPerson = require("../db/salesPerson");

exports.getAllUsers = async (req, res) => {
  // Get a connection from the pool
  try {
    const results = await User.getAllUsers();
    res.status(200).json({ users: results[0] });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getAllSalesPersons = async (req, res) => {
  try {
    const results = await SalesPerson.getAllSalesPersons();
    const salesPersons = results[0];
    // Send the product names in the desired format
    res.status(200).json({ salesPersons });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getSalesPerson = async (req, res) => {
  try {
    const { name } = req.params;
    const results = await SalesPerson.getSalesPerson(name);
    if (results[0].length === 0) {
      return res
        .status(404)
        .json({ error: `Person with name ${name} not found` });
    }
    res.status(200).json({ order: results[0] });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.addNewSalesPerson = async (req, res) => {
  try {
    const { id, name } = req.body;
    // Check if the product name is provided
    if (!name) {
      return res.status(400).json({ error: " Name is required" });
    }
    const results = await SalesPerson.getSalesPerson(name);
    if (results[0].length > 0) {
      return res.status(400).json({ message: "Person already exists" });
    }
    const salesPerson = new SalesPerson(name);
    await salesPerson.save();
    // Return a success response with the ID of the newly added product
    res.status(201).json({
      message: "Sales Person added successfully",
      salesPersonId: results.insertId,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.deleteSalesPerson = async (req, res) => {
  try {
    const { name } = req.params;
    const result = await SalesPerson.deletePerson(name);
    if (result[0].affectedRows === 0) {
      return res
        .status(404)
        .json({ error: `Person with name ${name} not found` });
    }
    res
      .status(200)
      .json({ message: `Person with name ${name} deleted successfully` });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.deleteUser = (req, res) => {
  try {
    const { id } = req.params;
    const result = User.deleteUser(id);
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: `User with id: ${id} not found` });
    }
    res
      .status(200)
      .json({ message: `User with id: ${id} deleted successfully` });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.updateSalesPersonName = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    const result = await User.updateUser(id, name);

    if (result[0].affectedRows === 0) {
      return res
        .status(404)
        .json({ error: `Sales person with id ${id} not found` });
    }

    res.status(200).json({
      message: `Sales person name with id ${id}  updated successfully`,
    });
  } catch (error) {
    console.error("Error updating sales person name:", error);
    res.status(500).json({ error: error.message });
  }
};
