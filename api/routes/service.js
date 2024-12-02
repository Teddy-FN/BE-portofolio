const express = require("express");

const app = express.Router();

// Controller
const serviceController = require("../controller/service");

// Get Service
app.get("/get-service", serviceController.getService);

// Get Service By Id
app.get("/get-service/:id", serviceController.getServiceById);

// Add Service
app.post("/add-service", serviceController.postService);

// Edit Service
app.put("/edit-service/:id", serviceController.editService);

// Delete
app.delete("/delete-service/:id", serviceController.deleteServiceById);

module.exports = app;
