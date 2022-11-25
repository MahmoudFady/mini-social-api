module.exports.getAll = (req, res, next) => {
  res.status(200).json({ message: "get all post api route" });
};
module.exports.create = (req, res, next) => {
  res.status(200).json({ message: "create post api route" });
};
module.exports.update = (req, res, next) => {
  res.status(200).json({ message: "update post api route" });
};
module.exports.getById = (req, res, next) => {
  res.status(200).json({ message: "get by id post api route" });
};
module.exports.delete = (req, res, next) => {
  res.status(200).json({ message: "delete post api route" });
};
module.exports.pushLike = (req, res, next) => {
  res.status(200).json({ message: "push like api route" });
};
module.exports.popLike = (req, res, next) => {
  res.status(200).json({ message: "pop like api route" });
};
