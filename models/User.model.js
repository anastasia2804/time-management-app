const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
      type: String,
      required: true
      // unique: true -> Ideally, should be unique, but its up to you
    },
    password: {
    type: String,
    required: true
  },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
