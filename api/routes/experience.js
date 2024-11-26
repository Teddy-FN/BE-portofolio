const express = require("express");

const app = express.Router();

// Controller
const experienceController = require("../controller/experience");

// Get List Experience
app.get("/get-experience", experienceController.getExperience);

// Get Experience By Id
app.get("/get-experience/:id", experienceController.getExperienceById);

// Create New Experience
app.post("/add-experience", experienceController.postExperience);

// Edit Experience
app.put("/edit-experience/:id", experienceController.editExperience);

// Delete
app.delete("/delete-experience/:id", experienceController.deleteExperienceById);

module.exports = app;
