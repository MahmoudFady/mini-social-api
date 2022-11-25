module.exports.signup = (req, res, next) => {
  res.status(200).json({ message: "signup route" });
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
