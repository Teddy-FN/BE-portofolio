const express = require("express");

const app = express.Router();

// Controller
const projectController = require("../controller/project");

app.get("/get-project", projectController.getProject);

app.post("/add-project", projectController.postProject);

app.put("/edit-project/:id", projectController.editProject);

app.delete("/delete-project/:id", projectController.deleteProject);

module.exports = app;
