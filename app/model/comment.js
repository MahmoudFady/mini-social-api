const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: new Date(),
  },
  imagesPath: { type: [String], default: [] },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  metaData: {
    likesCount: { type: Number, default: 0 },
  },
  replays: [{ type: mongoose.Schema.Types.ObjectId, ref: "Replay" }],
});
module.exports = mongoose.model("Comment", commentSchema);
