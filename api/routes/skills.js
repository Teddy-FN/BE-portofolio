const express = require("express"),
  app = express.Router(),
  // Controller
  skillsController = require("../controller/skills");

// Get Skills
app.get("/get-skills", skillsController.getSkills);

// Get Experience By Id
app.get("/get-skills/:id", skillsController.getSkillsById);

// Add Skills
app.post("/add-skills", skillsController.postSkills);

// Edit Skills
app.put("/edit-skills/:id", skillsController.editSkills);

// Delete
app.delete("/delete-skills/:id", skillsController.deleteSkillsById);

module.exports = app;
