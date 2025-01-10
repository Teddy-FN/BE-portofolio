const express = require("express"),
  app = express.Router(),
  fs = require("fs"),
  multer = require("multer"),
  // Define the writable upload directory for serverless environments
  uploadDir = "/tmp/uploads",
  // Set up multer storage using /tmp/uploads
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir); // Save files to /tmp/uploads
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
  upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Set file size limit to 5MB
  }).single("image"),
  // Controller
  projectController = require("../controller/project");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.get("/get-project", projectController.getProject);

app.get(
  "/get-project-by-category/:category",
  projectController.getProjectByCategory
);

app.post("/add-project", upload, projectController.postProject);

app.get("/get-project/:id", projectController.getProjectById);

app.put("/edit-project/:id", projectController.editProject);

app.delete("/delete-project/:id", projectController.deleteProject);

module.exports = app;
