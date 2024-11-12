const express = require("express");

const app = express.Router();

// Controller
const aboutMeController = require("../controller/about-me");

app.get("/get-about-me", aboutMeController.getAboutMe);

app.post("/add-about-me", aboutMeController.postAboutMe);

app.put("/edit-about-me", aboutMeController.editAboutMe);

module.exports = app;
