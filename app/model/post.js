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
  imagesPath: {
    type: Array,
    default: [],
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  metaData: {
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
  },
});
module.exports = mongoose.model("Post", postSchema);
