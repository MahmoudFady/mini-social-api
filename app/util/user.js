const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_KEY_WORD } = process.env;
module.exports.getToken = (_id, email) => {
  return jwt.sign({ _id, email }, JWT_KEY_WORD);
};
module.exports.findByEmailOrPhoneNum = (email, phoneNumber) => {
  return User.findOne({ $or: [{ email }, { phoneNumber }] }).select(
    "email phoneNumber"
  );
};
module.exports.updateById = (id, updatedData) => {
  return User.updateOne(
    { _id: id },
    {
      $set: {
        ...updatedData,
      },
    }
  );
};
module.exports.saveNewUser = async (userData) => {
  const { password, birthDate } = userData;
  userData.password = await bcrypt.hash(password, 10);
  userData.birthDate = new Date(birthDate);
  const newUser = await new User({
    ...userData,
  }).save();
  const token = this.getToken(newUser._id, newUser.email);
  return { newUser, token };
};
module.exports.getByName = (name) => {
  const regex = new RegExp(name);
  return User.find({
    fullName: { $regex: regex, $options: "i" },
  }).select("_id fullName imagePath");
};
