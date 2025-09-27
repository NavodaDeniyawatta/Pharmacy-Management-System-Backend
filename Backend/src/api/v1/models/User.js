// -------------------- Thirdparty Libraries and Modules --------------------
const mongoose = require("mongoose");

// -------------------- User Schema --------------------
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    image: {
      type: String,
    },
    telephone: {
      type: String,
      require: true,
    },
    birthday: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    userType: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
