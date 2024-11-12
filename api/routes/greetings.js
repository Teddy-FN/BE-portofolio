const express = require("express");

const app = express.Router();

// Controller
const greetingsController = require("../controller/greetings");

app.get("/greetings", greetingsController.greetings);

module.exports = app;
