const express = require("express");
const router = express.Router();
const replayController = require("../controller/comment");
router.post("/", replayController.create);
router.patch("/:id", replayController.update);
router.delete("/:id", replayController.delete);
router.post("/push-like/:id", replayController.pushLike);
router.post("/pop-like/:id", replayController.popLike);
module.exports = router;
