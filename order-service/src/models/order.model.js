const { Schema, model } = require("mongoose");

const Order = model(
  "Order",
  new Schema(
    {
      email: {
        type: String,
        required: [true, `Please provide email`],
        trim: true,
      },
      items: [
        {
          product_id: {
            type: String,
            require: [true, `Please provide product id`],
            trim: true,
          },
          quantity: {
            type: Number,
            default: 1,
            min: 1,
            requried: [true, `Please provide quantity`],
          },
          price: {
            type: Number,
            min: 0,
            default: 0,
            required: [true, `Please provide price`],
          },
        },
      ],
      status: {
        type: String,
        enum: [
          "pending",
          "paid",
          "shipped",
          "on the way",
          "delivered",
          "cancelled",
        ],
        default: "pending",
      },
      payment_status: {
        type: String,
        enum: ["unpaid", "paid", "failed"],
        default: "unpaid",
      },
      shipping_address: {
        address: {
          type: String,
          trim: true,
          required: [true, `Address is required`],
        },
        city: {
          type: String,
          required: [true, `City is required`],
          trim: true,
        },
        postalCode: {
          type: String,
          required: [true, `Postal code required`],
          trim: true,
          match: [
            /^[A-Za-z0-9]{5}$/,
            "Code must be exactly 5 alphanumeric letters.",
          ],
        },
        country: {
          type: String,
          default: "India",
        },
      },
    },
    { timestamps: true }
  )
);

module.exports = Order;
