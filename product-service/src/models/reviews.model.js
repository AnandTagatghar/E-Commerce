const mongoose = require("mongoose");
const Like = require("./likes.model");

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
      trim: true,
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
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);

Review.pre("findOneAndDelete", async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  if (doc) {
    await Like.deleteMany({ review: doc._id });
  }
  next();
});

Review.pre("deleteOne", async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  if (doc) {
    await Like.deleteMany({ review: doc._id });
  }
  next();
});

module.exports = mongoose.model("Review", Review);
