const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  clientID: {
    type: String,
    required: true,
  },
  clientSecretKey: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  token: {
    type: String,
  },
});

const user = mongoose.model("user", userSchema);
export {};
module.exports = user;
