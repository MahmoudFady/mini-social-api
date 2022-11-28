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
router.patch("/:id", checkAuth, postController.update);
router.get("/:id", postController.getById);
router.delete("/:id", checkAuth, postController.delete);
router.get("/:id/comments", postController.getPostComments);
router.post("/:id/like", checkAuth, postController.pushLike);
router.delete("/:id/like", checkAuth, postController.pullLike);
router.get("/:id/like", postController.getPostLikes);

module.exports = router;
