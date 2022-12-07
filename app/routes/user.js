const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const upload = require("../middleware/upload");
const userController = require("../controller/user");
router.get("/", userController.getAll);
router.post("/signup", userController.signup);
router.post("/signin", userController.singin);
router.get("/search-by-name", userController.searchByName);
router.patch("/", checkAuth, userController.update);
router.get("/:id", checkAuth, userController.getById);
router.patch(
  "/profile-image",
  upload.single("profileImage"),
  checkAuth,
  userController.updateProfileImage
);
router.get("/:id/posts", userController.getUserPosts);
router.delete("/id", checkAuth, userController.delete);
module.exports = router;
