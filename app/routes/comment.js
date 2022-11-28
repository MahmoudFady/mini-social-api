const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const upload = require("../middleware/upload");
const commentController = require("../controller/comment");
router.post(
  "/:postId",
  upload.array("commentImages", 2),
  checkAuth,
  commentController.create
);
router.get("/:id", commentController.getById);
router.patch("/:id", checkAuth, commentController.update);
router.delete("/:id", checkAuth, commentController.delete);
router.post("/:id/like", checkAuth, commentController.pushLike);
router.delete("/:id/like", checkAuth, commentController.pullLike);
module.exports = router;
