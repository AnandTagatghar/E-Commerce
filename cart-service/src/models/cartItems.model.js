const { Schema, model } = require("mongoose");

const cartItemSchema = new Schema(
  {
    cartID: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const CartItem = model("CartItem", cartItemSchema);
module.exports = CartItem;
