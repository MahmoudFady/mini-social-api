const Comment = require("../model/comment");
const Post = require("../model/post");
const fs = require("fs");
const path = require("path");
module.exports.create = async (decode, req, res, next) => {
  try {
    const commentData = {};
    commentData.creator = decode._id;
    commentData.content = req.body.content;
    commentData.post = req.params.postId;
    if (req.files) {
      commentData.imagesPath = req.files.map((file) => {
        return file.filename;
      });
    }
    const newComment = await (
      await new Comment({ ...commentData }).save()
    ).populate({ path: "creator", select: "_id fullName imagePath" });
    await Post.updateOne(
      { _id: commentData.post },
      {
        $push: { comments: newComment._id },
        $inc: { "metaData.commentsCount": 1 },
      }
    );
    return res
      .status(200)
      .json({ message: "comment created", comment: newComment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "something go wrong", error: error.message });
  }
};
module.exports.getById = async (req, res, next) => {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findById(commentId);
    return res.status(200).json({ message: "comment data", comment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "something go wrong", error: error.message });
  }
};
module.exports.update = async (decode, req, res, next) => {
  try {
    const creator = decode._id;
    const commentId = req.params.id;
    const content = req.body.content;
    await Comment.updateOne({ _id: commentId, creator }, { $set: { content } });
    return res.status(200).json({ message: "comment updated" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "something go wrong", error: error.message });
  }
};
module.exports.delete = async (decode, req, res, next) => {
  try {
    const creator = decode._id;
    const commentId = req.params.id;
    const { post, imagesPath } = await Comment.findOneAndDelete({
      _id: commentId,
      creator,
    }).select("post imagesPath");
    await Post.updateOne(
      { _id: post },
      {
        $pull: { comments: commentId },
        $inc: { "metaData.commentsCount": -1 },
      }
    );
    if (imagesPath.length > 0) {
      const filesName = imagesPath.map((path) => path.split("/").pop(1));
      for (const fileName of filesName) {
        fs.unlinkSync(path.join(__dirname, "../uploads", fileName));
      }
    }
    return res.status(200).json({ message: "comment deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "something go wrong", error: error.message });
  }
};
module.exports.pushLike = async (decode, req, res, next) => {
  try {
    const commentId = req.params.id;
    const userId = decode._id;
    await Comment.updateOne(
      { _id: commentId, likes: { $ne: userId } },
      {
        $push: { likes: userId },
        $inc: { "metaData.likesCount": 1 },
      }
    );
    return res.status(200).json({ message: "liked comment" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "something go wrong", error: error.message });
  }
};
module.exports.pullLike = async (decode, req, res, next) => {
  try {
    const commentId = req.params.id;
    const userId = decode._id;
    await Comment.updateOne(
      { _id: commentId, likes: userId },
      {
        $pull: { likes: userId },
        $inc: { "metaData.likesCount": -1 },
      }
    );
    return res.status(200).json({ message: "un liked comment" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "something go wrong", error: error.message });
  }
};
