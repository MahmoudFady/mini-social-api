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
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  replays: [{ type: mongoose.Schema.Types.ObjectId, ref: "Replay" }],
});
module.exports = mongoose.model("Comment", commentSchema);
