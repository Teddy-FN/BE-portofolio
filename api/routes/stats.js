const express = require("express"),
  router = express.Router();

// Controller
const statsController = require("../controller/stats");

router.get("/get-stats", statsController.getAllStats);

module.exports = router;
