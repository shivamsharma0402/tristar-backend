const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, default: "TriStar@123" },
});

module.exports = mongoose.model("users", UserSchema);
