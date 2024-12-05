const Stack = require("../models/stack");

exports.getStack = async (req, res, next) => {
  try {
    const getData = await Stack.findAll();
    return res.status(200).json({ message: "Success", data: getData });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    console.log("resEND");
  }
};

// Create a new Stack entry
exports.postStack = async (req, res) => {
  const { name, icon, createdBy } = req.body;

  try {
    const existingSkill = await Stack.findOne({ where: { name } });
    if (existingSkill) {
      return res.status(400).json({ message: "Stack already exists" });
    }

    const newStack = await Stack.create({
      name,
      icon,
      createdBy,
    });

    return res.status(201).json({ message: "Success", data: newData });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    console.log("resEND");
  }
};

// Edit/Update an existing Stack entry
exports.editStack = async (req, res) => {
  const { id } = req.params;
  const { name, icon, modifiedBy } = req.body;

  try {
    // Find existing Stack by ID
    const stack = await Stack.findByPk(id);

    if (!stack) {
      return res.status(404).json({ message: "Stack not found" });
    }

    // Check if data is identical
    const isSameData = stack.name === name && stack.icon === icon;

    if (isSameData) {
      return res
        .status(400)
        .json({ message: "No changes detected. Data is identical." });
    }

    // Update data
    await stack.update({
      name,
      icon,
      modifiedBy,
    });

    return res
      .status(200)
      .json({ message: "Stack updated successfully", data: stack });
  } catch (error) {
    console.error("Error updating stack:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Soft delete a Stack entry
exports.deleteStack = async (req, res) => {
  const { id } = req.params;

  try {
    const stack = await Stack.findByPk(id);

    if (!stack) {
      return res.status(404).json({ message: "Stack not found" });
    }

    // Soft delete the entry
    await stack.destroy();

    return res.status(200).json({ message: "Stack deleted successfully" });
  } catch (error) {
    console.error("Error deleting stack:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
