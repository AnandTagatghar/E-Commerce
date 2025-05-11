const express = require("express");
const cookie_parser = require("cookie-parser");
const errorHandler = require("./middlewares/errorHandler.middleware");
const { paymentRouter } = require("./routers/payment.router");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie_parser());

app.use("/api/v1/payment-service", paymentRouter);

app.use(errorHandler);

module.exports = app;
