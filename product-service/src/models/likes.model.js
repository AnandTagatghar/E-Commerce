const { Schema, model } = require("mongoose");

const Likes = new Schema(
  {
    username: {
      type: String,
      require: [true, `username required`],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Like", Likes);
