const express = require("express");

const app = express.Router();

// Controller
const skillsController = require("../controller/skills");

app.get("/get-skills", skillsController.getSkills);

app.post("/add-skills", skillsController.postSkills);

app.put("/edit-skills/:id", skillsController.editSkills);

module.exports = app;
