const User = require("../model/user");
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
    }).save();
    return res.status(201).json({
      message: "user signed up",
      user: newUser,
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
    return res
      .status(200)
      .json({ message: "successfully signin", user: existedUser });
  } catch (err) {
    res.status(500).json({ message: "something go wrong" });
  }
};
module.exports.update = (req, res, next) => {
  res.status(200).json({ message: "update route" });
};
module.exports.getById = (req, res, next) => {
  res.status(200).json({ message: "get by id route" });
};
