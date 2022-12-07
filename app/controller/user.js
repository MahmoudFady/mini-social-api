const User = require("../model/user");
const Post = require("../model/post");
const jwt = require("jsonwebtoken");
const { JWT_KEY_WORD } = process.env;
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
module.exports.getAll = async (req, res, next) => {
  try {
    const users = await User.find().select("fullName imagePath");
    res
      .status(200)
      .json({ message: "all users", usersCount: users.length, users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "something go wrong", error: error.message });
  }
};
module.exports.signup = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      address,
      gender,
      birthDate,
      password,
    } = req.body;
    const { country, state, city } = address;
    const existedUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });
    if (existedUser) {
      const message =
        existedUser.email == email ? "email address" : "phone number";
      return res
        .status(409)
        .json({ message: message + " already exist", user: null });
    }
    const hash = await bcrypt.hash(password, 10);
    const newUser = await new User({
      fullName,
      email,
      phoneNumber,
      address: { country, state, city },
      birthDate: new Date(birthDate),
      gender,
      password: hash,
    }).save();
    const token = jwt.sign(
      { _id: newUser._id, email: newUser.email },
      JWT_KEY_WORD
    );
    return res.status(200).json({
      message: "user signed up",
      user: newUser,
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "something go wrong", error: error.message });
  }
};

module.exports.singin = async (req, res, next) => {
  try {
    const { email, phoneNumber, password } = req.body;
    const criteria = email ? { email } : { phoneNumber };
    const existedUser = await User.findOne(criteria);
    if (!existedUser) {
      return res
        .status(404)
        .json({ message: "account does't exist", user: null });
    }
    const isPasswordSame = await bcrypt.compare(password, existedUser.password);
    if (!isPasswordSame) {
      return res.status(401).json({ message: "wrong password", user: null });
    }
    const token = jwt.sign(
      { _id: existedUser._id, email: existedUser.email },
      JWT_KEY_WORD
    );
    return res
      .status(200)
      .json({ message: "successfully signin", user: existedUser, token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "something go wrong", error: error.message });
  }
};
module.exports.update = async (decode, req, res, next) => {
  try {
    const userId = decode._id;
    const { fullName, address } = req.body;
    const { country, state, city } = address;
    await User.updateOne(
      { _id: userId },
      {
        $set: {
          fullName,
          address: { country, state, city },
        },
      }
    );
    return res
      .status(200)
      .json({ message: "user info updated", updated: true });
  } catch (err) {
    res.status(500).json({ message: "something go wrong", updated: false });
  }
};
module.exports.searchByName = async (req, res, next) => {
  try {
    const name = req.query["name"];
    const regex = new RegExp(name);
    const users = await User.find({
      fullName: { $regex: regex, $options: "i" },
    }).select("_id fullName imagePath");
    res.status(200).json({ usersCount: users.length, users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "something go wrong", error: error.message });
  }
};

module.exports.getById = async (req, res, next) => {
  try {
    const id = req.params["id"];
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ message: "user does not exist", user: null });
    }
    return res.status(200).json({ message: "get user by id", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "something go wrong", error: error.message });
  }
};
module.exports.updateProfileImage = async (decode, req, res, next) => {
  try {
    const userId = decode._id;
    const imagePath =
      req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename;
    await User.updateOne({ _id: userId }, { $set: { imagePath } });
    res.status(200).json({ message: "profile image updated", imagePath });
  } catch (error) {
    res
      .status(500)
      .json({ message: "something go wrong", error: error.message });
  }
};
module.exports.getUserPosts = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const posts = await Post.find({ creator: userId })
      .populate({
        path: "creator",
        select: "_id fullName imagePath",
      })
      .select("-likes -comments");
    res
      .status(200)
      .json({ message: "user posts", postsCount: posts.length, posts });
  } catch (error) {
    res
      .status(500)
      .json({ message: "something go wrong", error: error.message });
  }
};
module.exports.delete = async (decode, req, res, next) => {
  try {
    const userId = decode._id;
    const deletedUser = await User.findByIdAndDelete(userId).select(
      "_id fullName imagePath"
    );
    res.status(200).json({ message: "delete user", deletedUser });
    const imageName = deletedUser.imagePath.split("/").pop();
    const filePath = path.join(__dirname, "../uploads", imageName);
    fs.unlinkSync(filePath);
  } catch (error) {
    res
      .status(500)
      .json({ message: "something go wrong", error: error.message });
  }
};
