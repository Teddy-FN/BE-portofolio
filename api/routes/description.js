const express = require("express"),
  app = express.Router(),
  // Controller
  descriptionController = require("../controller/description");

app.get("/hello", descriptionController.greetings);

module.exports = app;
