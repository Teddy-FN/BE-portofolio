const express = require("express");

const dashboardController = require("../controller/dashboard");
const app = express.Router();

app.get("/get-dashboard", dashboardController.getDashboard);

module.exports = app;
