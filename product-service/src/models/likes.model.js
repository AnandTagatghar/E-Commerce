const { Schema, model } = require("mongoose");

const Likes = new Schema(
  {
    email: {
      type: String,
      require: [true, `Email required`],
      trim: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref:'Product'
    },
    review: {
      type: Schema.Types.ObjectId,
      ref:"Review"
    }
  },
  { timestamps: true }
);

module.exports = model("Like", Likes);
