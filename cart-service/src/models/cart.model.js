const { Schema, model } = require("mongoose");

const cartSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    totalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalQuantity: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

cartSchema.pre("findOneAndDelete", async function (next) {
  const cart = this;
  const CartItem = require("./cartItems.model");
  const cartItems = await CartItem.find({ cartID: cart._id });
  if (cartItems.length > 0) {
    await CartItem.deleteMany({ cartID: cart._id });
  }
  next();
})

const Cart = model("Cart", cartSchema);

module.exports = Cart;
