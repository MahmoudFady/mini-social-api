const fs = require("fs");
const path = require("path");
module.exports.sendSuccessResponse = (res, data) => {
  res.status(200).json({ ...data });
};
module.exports.sendErrorResponse = (res, statusCode, data) => {
  res.status(statusCode).json({ ...data });
};
module.exports.deleteFile = (filePath) => {
  const fileName = filePath.split("/").pop();
  fs.unlinkSync(path.join(__dirname, "../uploads", fileName));
};
module.exports.deleteArrayOfFiles = (filesPath) => {
  for (let path of filesPath) {
    this.deleteFile(path);
  }
};
module.exports.getuploadedFilePath = (req) => {
  const filePath =
    req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename;
  return filePath;
};
module.exports.getUploadedFilesPath = (req) => {
  const imagesPath = req.files.map((file) => {
    return req.protocol + "://" + req.get("host") + "/uploads/" + file.filename;
  });
  return imagesPath;
};
