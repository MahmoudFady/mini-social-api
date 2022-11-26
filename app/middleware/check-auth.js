const jwt = require("jsonwebtoken");
const { JWT_KEY_WORD } = process.env;
module.exports = (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const decode = jwt.verify(token, JWT_KEY_WORD);
    next(decode);
  } catch (err) {
    res.status(401).json({ message: "un authorized user" });
  }
};
