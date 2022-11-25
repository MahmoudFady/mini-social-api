const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: new Date(),
  },
  hidden: {
    type: Boolean,
    default: false,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});
module.exports = mongoose.model("Post", postSchema);
