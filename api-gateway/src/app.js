require("dotenv").config();

const express = require("express");
const {
  userServiceProxy,
  authServiceProxy,
  productServiceProxy,
  cartServiceProxy,
  orderServiceProxy,
  paymentServiceProxy,
} = require("./routers/http.proxy");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user-service", userServiceProxy);
app.use("/api/v1/auth-service", authServiceProxy);
app.use("/api/v1/product-service", productServiceProxy);
app.use("/api/v1/cart-service", cartServiceProxy);
app.use("/api/v1/order-service", orderServiceProxy);
app.use("/api/v1/payment-service", paymentServiceProxy);

module.exports = app;
