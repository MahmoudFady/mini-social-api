const User = require("../model/user");
const Post = require("../model/post");
const bcrypt = require("bcrypt");
const {
  sendSuccessResponse,
  sendErrorResponse,
  deleteFile,
  getuploadedFilePath,
} = require("../util/shared-utils");
const {
  getToken,
  findByEmailOrPhoneNum,
  saveNewUser,
  updateById,
  getByName,
} = require("../util/user");
module.exports.getAll = async (req, res) => {
  try {
    const users = await User.find().select("fullName imagePath");
    return sendSuccessResponse(res, {
      message: "all users",
      usersCount: users.length,
      users,
    });
  } catch (error) {
    sendErrorResponse(res, 500, {
      message: "something go wrong",
      error: error.message,
    });
  }
};
module.exports.signup = async (req, res) => {
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
    const existedUser = await findByEmailOrPhoneNum(email, phoneNumber);
    if (existedUser) {
      const message =
        existedUser.email == email ? "email address" : "phone number";
      return sendSuccessResponse(res, {
        message: message + " already exist",
        user: null,
      });
    }
    const { newUser, token } = await saveNewUser({
      fullName,
      email,
      phoneNumber,
      address,
      gender,
      birthDate,
      password,
    });
    return sendSuccessResponse(res, {
      message: "user signed up",
      user: newUser,
      token,
    });
  } catch (error) {
    sendErrorResponse(res, 500, {
      message: "something go wrong",
      error: error.message,
    });
  }
};

module.exports.singin = async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;
    const criteria = email ? { email } : { phoneNumber };
    const existedUser = await User.findOne(criteria);
    const isPasswordSame = await bcrypt.compare(password, existedUser.password);
    if (!existedUser || !isPasswordSame) {
      return sendErrorResponse(res, 404, {
        message: "account does't exist or wrong password",
        user: null,
      });
    }
    const token = getToken(existedUser._id, existedUser.email);
    return sendSuccessResponse(res, {
      message: "successfully signin",
      user: existedUser,
      token,
    });
  } catch (error) {
    sendErrorResponse(res, 500, {
      message: "something go wrong",
      error: error.message,
    });
  }
};
module.exports.update = async (decode, req, res, next) => {
  try {
    const userId = decode._id;
    const { fullName, address } = req.body;
    await updateById(userId, { fullName, address });
    return sendSuccessResponse(res, {
      message: "user info updated",
      updated: true,
    });
  } catch (err) {
    sendErrorResponse(res, 500, {
      message: "something go wrong",
      updated: false,
    });
  }
};
module.exports.searchByName = async (req, res) => {
  try {
    const name = req.query["name"];
    const users = await getByName(name);
    sendSuccessResponse(res, { usersCount: users.length, users });
  } catch (error) {
    sendErrorResponse(res, 500, {
      message: "something go wrong",
      error: error.message,
    });
  }
};

module.exports.getById = async (req, res) => {
  try {
    const id = req.params["id"];
    const user = await User.findById(id).select("-password");
    if (!user) {
      return sendErrorResponse(res, 404, {
        message: "user does not exist",
        user: null,
      });
    }
    return sendSuccessResponse(res, { message: "get user by id", user });
  } catch (error) {
    sendErrorResponse(res, 500, {
      message: "something go wrong",
      error: error.message,
    });
  }
};
module.exports.updateProfileImage = async (decode, req, res, next) => {
  try {
    const userId = decode._id;
    const imagePath = getuploadedFilePath(req);
    await User.updateOne({ _id: userId }, { $set: { imagePath } });
    sendSuccessResponse(res, { message: "profile image updated", imagePath });
  } catch (error) {
    sendErrorResponse(res, 500, {
      message: "something go wrong",
      error: error.message,
    });
  }
};
module.exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.params.id;
    const posts = await Post.find({ creator: userId })
      .populate({
        path: "creator",
        select: "_id fullName imagePath",
      })
      .select("-likes -comments");
    sendSuccessResponse(res, {
      message: "user posts",
      postsCount: posts.length,
      posts,
    });
  } catch (error) {
    sendErrorResponse(res, 500, {
      message: "something go wrong",
      error: error.message,
    });
  }
};
module.exports.delete = async (decode, req, res) => {
  try {
    const userId = decode._id;
    const deletedUser = await User.findByIdAndDelete(userId).select(
      "_id fullName imagePath"
    );
    res.status(200).json({ message: "delete user", deletedUser });
    deleteFile(deletedUser.imagePath);
  } catch (error) {
    sendErrorResponse(res, 500, {
      message: "something go wrong",
      error: error.message,
    });
  }
};
