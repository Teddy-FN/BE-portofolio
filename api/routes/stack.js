const express = require("express"),
  router = express.Router(),
  // Controller
  stackController = require("../controller/stack");

router.get("/get-stack", stackController.getStack);
router.post("/add-stack", stackController.postStack);
router.put("/edit-stack/:id", stackController.editStack);
router.delete("/delete-stack/:id", stackController.deleteStack);

module.exports = router;
