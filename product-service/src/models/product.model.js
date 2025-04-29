const { Schema, model } = require("mongoose");
const Review = require("./reviews.model");

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
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],
    is_active: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

Product.pre("findOneAndDelete", async function (next) {
  const product = await this.model.findOne(this.getFilter());
  if (product) {
    await Review.deleteMany({ _id: { $in: product.reviews } });
  }
  next();
});

module.exports = model("Product", Product);
