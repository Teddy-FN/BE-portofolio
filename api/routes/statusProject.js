const express = require("express");

const app = express.Router();

// Controller
const statusProjectController = require("../controller/statusProject");

// Get Status Project
app.get("/get-status-project", statusProjectController.getStatusProject);

// Get Status Project By Id
app.get(
  "/get-status-project/:id",
  statusProjectController.getStatusProjectById
);

// Add Status Project
app.post("/add-status-project", statusProjectController.postStatusProject);

// Edit Status Project
app.put("/edit-status-project/:id", statusProjectController.editStatusProject);

// Delete
app.delete(
  "/delete-status-project/:id",
  statusProjectController.deleteStatusProjectById
);

module.exports = app;
