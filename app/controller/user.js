const User = require("../model/user");
const jwt = require("jsonwebtoken");
const { JWT_KEY_WORD } = process.env;
const bcrypt = require("bcrypt");
const { updateOne } = require("../model/user");
module.exports.getAll = async (req, res, next) => {
  const users = await User.find().select("-password");
  res
    .status(200)
    .json({ message: "all users", usersCount: users.length, users });
};
module.exports.signup = async (req, res, next) => {
  try {
    const { fullName, email, phoneNumber, address, birthDate, password } =
      req.body;
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
  } catch (err) {
    res.status(500).json({ message: "something go wrong" });
  }
};

module.exports.singin = async (req, res, next) => {
  try {
    const { email, phoneNumber, password } = req.body;
    const criteria = email ? { email } : { phoneNumber };
    const existedUser = await User.findOne(criteria);
    console.log(existedUser);
    if (!existedUser) {
      console.log("user does not exist");
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
  } catch (err) {
    res.status(500).json({ message: "something go wrong" });
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
  } catch (err) {
    res.status(500).json({ message: "something go wrong" });
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
    return res.status(200).json({ message: "successfully get the user", user });
  } catch (err) {
    res.status(500).json({ message: "something go wrong" });
  }
};
module.exports.updateProfileImage = async (decode, req, res, next) => {
  try {
    const userId = decode._id;
    const imagePath =
      req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename;
    console.log(imagePath);
    await User.updateOne({ _id: userId }, { $set: { imagePath } });
    res.status(200).json({ message: "profile image updated", imagePath });
  } catch (err) {
    res.status(500).json({ message: "something go wrong" });
  }
};
