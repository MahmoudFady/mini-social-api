const User = require("../model/user");
const jwt = require("jsonwebtoken");
const { JWT_KEY_WORD } = process.env;
const bcrypt = require("bcrypt");
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
    })
      .save()
      .select("-password");
    const token = jwt.sign({ _id: newUser._id, email }, JWT_KEY_WORD);
    return res.status(201).json({
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
module.exports.update = (req, res, next) => {
  res.status(200).json({ message: "update route" });
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
