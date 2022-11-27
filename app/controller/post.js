const Post = require("../model/post");
module.exports.getAll = async (req, res, next) => {
  try {
    const posts = await Post.find();
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
      const imagesPath = files.map((file) => {
        return (
          req.protocol + "://" + req.get("host") + "/uploads/" + file.filename
        );
      });
      postData.imagesPath = imagesPath;
    }
    const newPost = await (
      await new Post({ ...postData }).save()
    ).populate({ path: "creator", select: "_id imagePath fullName" });

    return res.status(200).json({ message: "post created", post: newPost });
  } catch (err) {
    res.status(500).json({ message: "something go wrong" });
  }
};
module.exports.update = (req, res, next) => {
  try {
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
module.exports.delete = (req, res, next) => {
  try {
  } catch (err) {
    res.status(500).json({ message: "something go wrong" });
  }
};
module.exports.pushLike = (req, res, next) => {
  try {
  } catch (err) {
    res.status(500).json({ message: "something go wrong" });
  }
};
module.exports.popLike = (req, res, next) => {
  try {
  } catch (err) {
    res.status(500).json({ message: "something go wrong" });
  }
};
