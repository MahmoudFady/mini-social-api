const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const upload = require("../middleware/upload");
const postController = require("../controller/post");
router.get("/", postController.getAll);
router.post(
  "/",
  upload.array("postImages", 5),
  checkAuth,
  postController.create
);
router.patch("/:id", postController.update);
router.get("/:id", postController.getById);
router.delete("/:id", postController.delete);
router.post("/push-like/:id", postController.pushLike);
router.post("/pop-like/:id", postController.popLike);
module.exports = router;
