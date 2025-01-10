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
  certificateController = require("../controller/certificate");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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
