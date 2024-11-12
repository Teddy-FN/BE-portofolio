const express = require("express");

const app = express.Router();

// Controller
const educationController = require("../controller/education");

app.get("/get-education", educationController.getEducation);

app.post("/add-education", educationController.postEducation);

app.put("/edit-education/:id", educationController.editEducation);

module.exports = app;
