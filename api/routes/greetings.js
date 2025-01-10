const express = require("express"),
  app = express.Router(),
  // Controller
  greetingsController = require("../controller/greetings");

app.get("/greetings", greetingsController.greetings);

module.exports = app;
