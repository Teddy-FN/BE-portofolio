const express = require("express");

const app = express.Router();

// Controller
const educationController = require("../controller/education");

// Get List Education
app.get("/get-education", educationController.getEducation);

// Get By Id
app.get("/get-education/:id", educationController.getEducationById);

// Add New Education
app.post("/add-education", educationController.postEducation);

// Edit Education
app.put("/edit-education/:id", educationController.editEducation);

// Delete Education
app.delete("/delete-education/:id", educationController.deleteEducationById);

module.exports = app;
