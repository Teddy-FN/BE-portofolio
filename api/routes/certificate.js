const express = require("express");

const app = express.Router();
const fs = require("fs");
const multer = require("multer");

// Define the writable upload directory for serverless environments
const uploadDir = "/tmp/uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer storage using /tmp/uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Save files to /tmp/uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Set file size limit to 5MB
}).single("image");

// Controller
const certificateController = require("../controller/certificate");

app.get("/get-certificate", certificateController.getCertificate);

app.get(
  "/get-certificate-by-category/:category",
  certificateController.getCertificateByCategory
);

app.post("/add-certificate", upload, certificateController.postCertificate);

app.get("/get-certificate/:id", certificateController.getCertificateById);

app.put("/edit-certificate/:id", certificateController.editCertificate);

app.delete("/delete-certificate/:id", certificateController.deleteCertificate);

module.exports = app;
