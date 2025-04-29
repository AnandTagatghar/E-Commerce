const mongoose = require("mongoose");

const Review = new mongoose.Schema(
  {
    username: {
      type: String,
      require: [true, `Please provide username`],
      trim: true,
    },
    email: {
      type: String,
      require: [true, `Email field required`],
      trim: true
    },
    comment: {
      type: String,
      require: [true, `Please provide feedback`],
      trim: true,
    },
    rating: {
      type: Number,
      min: [1, `Rating must be at least 1`],
      max: [5, `Rating must be at most 5`],
      require: [true, `Please rate the product`],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", Review);
