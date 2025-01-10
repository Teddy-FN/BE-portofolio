const express = require("express"),
  // Controllers
  authController = require("../controller/user"),
  router = express.Router();

// Login Post
router.post("/login", authController?.login);

// Logout
router.post("/logout", authController?.logout);

module.exports = router;
