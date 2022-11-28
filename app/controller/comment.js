const Comment = require("../model/comment");
const Post = require("../model/post");
module.exports.create = async (decode, req, res, next) => {
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
};
module.exports.getById = async (req, res, next) => {
  const commentId = req.params.id;
  const comment = await Comment.findById(commentId);
  return res.status(200).json({ message: "comment data", comment });
};
module.exports.update = async (decode, req, res, next) => {
  const creator = decode._id;
  const commentId = req.params.id;
  const content = req.body.content;
  await Comment.updateOne({ _id: commentId, creator }, { $set: { content } });
  return res.status(200).json({ message: "comment updated" });
};
module.exports.delete = async (decode, req, res, next) => {
  const creator = decode._id;
  const commentId = req.params.id;
  const deletedComment = await Comment.findOneAndDelete({
    _id: commentId,
    creator,
  });
  await Post.updateOne(
    { _id: deletedComment.post },
    {
      $pull: { comments: commentId },
      $inc: { "metaData.commentsCount": -1 },
    }
  );
  return res.status(200).json({ message: "comment deleted" });
};
module.exports.pushLike = async (decode, req, res, next) => {
  const commentId = req.params.id;
  const userId = decode._id;
  await Comment.updateOne(
    { _id: commentId, likes: { $ne: userId } },
    {
      $push: { likes: userId },
      $inc: { "metaData.likesCount": 1 },
    }
  );
  res.status(200).json({ message: "liked comment" });
};
module.exports.pullLike = async (decode, req, res, next) => {
  const commentId = req.params.id;
  const userId = decode._id;
  await Comment.updateOne(
    { _id: commentId, likes: userId },
    {
      $pull: { likes: userId },
      $inc: { "metaData.likesCount": -1 },
    }
  );
};
