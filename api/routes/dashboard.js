const express = require("express"),
  dashboardController = require("../controller/dashboard"),
  app = express.Router();

app.get("/get-dashboard", dashboardController.getDashboard);

module.exports = app;
