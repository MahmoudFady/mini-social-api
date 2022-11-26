const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const userController = require("../controller/user");
router.post("/signup", userController.signup);
router.post("/signin", userController.singin);
router.patch("/", checkAuth, userController.update);
router.get("/:id", userController.getById);

module.exports = router;
