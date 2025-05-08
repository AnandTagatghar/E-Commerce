const { Schema, model } = require("mongoose");
const CartItem = require("./cartItems.model");

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
  const cartItems = await this.model.findOne(this.getQuery());
  if (cartItems) {
    await CartItem.deleteMany({ cartID: cartItems._id });
  }
  next();
})

const Cart = model("Cart", cartSchema);

module.exports = Cart;
