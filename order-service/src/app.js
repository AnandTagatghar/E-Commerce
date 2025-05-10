const express = require("express");
const cookie_parser = require("cookie-parser");
const errorHandler = require("./middlewares/errorHandler.middleware");
const { orderRouter } = require("./routers/order.router");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie_parser());

app.use("/api/v1/order-service", orderRouter);

app.use(errorHandler);
module.exports = app;
