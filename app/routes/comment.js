const express = require("express");
const router = express.Router();
const commentController = require("../controller/comment");
router.post("/", commentController.create);
router.patch("/:id", commentController.update);
router.delete("/:id", commentController.delete);
router.post("/push-like/:id", commentController.pushLike);
router.post("/pop-like/:id", commentController.popLike);
module.exports = router;
