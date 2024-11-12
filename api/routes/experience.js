const express = require("express");

const app = express.Router();

// Controller
const experienceController = require("../controller/experience");

app.get("/get-experience", experienceController.getExperience);

app.post("/add-experience", experienceController.postExperience);

app.put("/edit-experience/:id", experienceController.editExperience);

module.exports = app;
