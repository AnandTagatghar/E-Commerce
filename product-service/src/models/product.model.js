const { Schema, model } = require("mongoose");
const Review = require("./reviews.model");
const Like = require("./likes.model");

const Product = new Schema(
  {
    product_name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      require: true,
      trim: true,
    },
    category: {
      type: String,
      require: true,
      trim: true,
    },
    price: {
      type: Number,
      default: 1000,
      required: true,
      min: 50,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    count_in_stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    image_url: {
      type: String,
      required: true,
      trim: true,
    },
    image_key: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    is_active: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

Product.pre("findOneAndDelete", async function (next) {
  const review = await this.model.findOne(this.getQuery());
  if (review) {
    await Review.deleteMany({ product: review._id });
  }
  next();
});

Product.pre("findOneAndDelete", async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  if (doc) {
    await Like.deleteMany({ product: doc._id });
  }
  next();
});

module.exports = model("Product", Product);
