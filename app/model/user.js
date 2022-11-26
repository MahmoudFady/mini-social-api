const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true, 
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "invalid email"],
  },
  phoneNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  imagePath: {
    type: String,
  },
  address: {
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
  },
  birthDate: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("User", userSchema);
