const Post = require("../model/post");
const fs = require("fs");
const path = require("path");
const {
  getUploadedFilesPath,
  deleteArrayOfFiles,
} = require("../util/shared-utils");
module.exports.getAll = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate({ path: "creator", select: "fullName imagePath" })
      .select("-comments -likes");
    res
      .status(200)
      .json({ message: "get all posts", postsCount: posts.length, posts });
  } catch (err) {
    res.status(500).json({ message: "something go wrong" });
  }
};
module.exports.create = async (decode, req, res, next) => {
  try {
    const postData = {};
    postData.content = req.body.content;
    postData.creator = decode._id;
    const files = req.files;
    if (files) {
      postData.imagesPath = getUploadedFilesPath(req);
    }
    const newPost = await (
      await new Post({ ...postData }).save()
    ).populate({ path: "creator", select: "_id imagePath fullName" });

    return res.status(200).json({ message: "post created", post: newPost });
  } catch (err) {
    res.status(500).json({ message: "something go wrong" });
  }
};
module.exports.update = async (decode, req, res, next) => {
  try {
    const postId = req.params.id;
    const content = req.body.content;
    await Post.updateOne({ _id: postId }, { $set: { content } });
    res.status(200).json({ message: "post updated" });
  } catch (err) {
    res.status(500).json({ message: "something go wrong" });
  }
};
module.exports.getById = async (req, res, next) => {
  try {
    const id = req.params["id"];
    const post = await Post.findById(id)
      .populate({
        path: "creator",
        select: "_id fullName imagePath",
      })
      .select("-likes -comments");
    res.status(200).json({ message: "post data", post });
  } catch (err) {
    res.status(500).json({ message: "something go wrong" });
  }
};
module.exports.getPostComments = async (req, res, next) => {
  const postId = req.params.id;
  const { comments } = await Post.findById(postId)
    .populate({
      path: "comments",
      populate: { path: "creatro", select: "_id fullName imagePath" },
    })
    .select("-_id comments");
  res.status(200).json({ message: "post comments ", comments });
};
module.exports.delete = async (decode, req, res, next) => {
  try {
    const creator = decode._id;
    const postId = req.params.id;
    const { imagesPath } = await Post.findOneAndDelete({
      _id: postId,
      creator,
    }).select("imagesPath");
    if (imagesPath.length > 0) {
      deleteArrayOfFiles(imagesPath);
    }
    res.status(200).json({ message: "post deleted" });
  } catch (err) {
    res.status(500).json({ message: "something go wrong" });
  }
};
module.exports.pushLike = async (decode, req, res, next) => {
  try {
    const creator = decode._id;
    const postId = req.params.id;
    await Post.updateOne(
      { _id: postId, likes: { $ne: creator } },
      { $push: { likes: creator }, $inc: { "metaData.likesCount": 1 } }
    );
    res.status(200).json({ message: "posted liked" });
  } catch (err) {
    res.status(500).json({ message: "something go wrong", error: err.message });
  }
};
module.exports.pullLike = async (decode, req, res, next) => {
  try {
    const creator = decode._id;
    const postId = req.params.id;
    await Post.updateOne(
      { _id: postId, likes: creator },
      { $pull: { likes: creator }, $inc: { "metaData.likesCount": -1 } }
    );
    res.status(200).json({ message: "posted un liked" });
  } catch (err) {
    res.status(500).json({ message: "something go wrong", error: err.message });
  }
};
module.exports.getPostLikes = async (req, res) => {
  try {
    const postId = req.params.id;
    const likes = await Post.findById(postId)
      .populate({ path: "likes", select: "_id fullName imagePath" })
      .select("likes");
    res.status(200).json({ message: "post likes", likes });
  } catch (err) {
    res.status(500).json({ message: "something go wrong", error: err.message });
  }
};
