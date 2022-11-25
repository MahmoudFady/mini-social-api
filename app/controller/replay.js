module.exports.create = (req, res, next) => {
  res.status(200).json({ message: "create replay api route" });
};
module.exports.update = (req, res, next) => {
  res.status(200).json({ message: "update replay api route" });
};
module.exports.delete = (req, res, next) => {
  res.status(200).json({ message: "delete replay api route" });
};
module.exports.pushLike = (req, res, next) => {
  res.status(200).json({ message: "push like api route" });
};
module.exports.popLike = (req, res, next) => {
  res.status(200).json({ message: "pop like api route" });
};
