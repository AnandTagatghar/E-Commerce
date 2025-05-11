const { Schema, model } = require("mongoose");

module.exports = model(
  "Payment",
  new Schema(
    {
      order_id: {
        type: String,
        required: [true, `Order Id missing`],
        trim: true,
      },
      email: {
        type: String,
        required: [true, `Email is missing`],
        trim: true,
      },
      amount: {
        type: Number,
        min: 0,
        required: [true, `Amount is missing`],
      },
      currency: {
        type: String,
        default: "INR",
      },
      payment_menthod: {
        type: String,
        enum: ["razorpay"],
        default: "razorpay",
        required: [true, `Payment Method is missing`],
      },
      status: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending",
      },
      razorpay_link_id: {
        type: String,
        required: [true, `Razorpay link id required`],
        trim: true,
      },
      razorpay_link_url: {
        type: String,
        required: [true, `Razorpay link url required`],
        trim: true,
      },
    },
    { timestamps: true }
  )
);
