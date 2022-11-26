const User = require("../model/user");
const bcrypt = require("bcrypt");
module.exports.signup = async (req, res, next) => {
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
  return res.status(201).json({
    message: "user signed up",
    user: newUser,
  });
};

module.exports.singin = (req, res, next) => {
  res.status(200).json({ message: "signin route" });
};
module.exports.update = (req, res, next) => {
  res.status(200).json({ message: "update route" });
};
module.exports.getById = (req, res, next) => {
  res.status(200).json({ message: "get by id route" });
};
