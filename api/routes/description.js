const express = require("express");

const app = express.Router();

// Controller
const descriptionController = require("../controller/description");

app.get("/hello", descriptionController.greetings);

module.exports = app;
