const express = require("express");
const errorHandler = require("./middlewares/errorHandler.middleware");
const { productRouter } = require("./routers/product.router");
const cookieParser = require("cookie-parser");
const { reviewRouter } = require("./routers/review.router");
const { likeRouter } = require("./routers/like.router");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/product-service/product", productRouter);
app.use("/api/v1/product-service/review", reviewRouter);
app.use("/api/v1/product-service/like", likeRouter);

app.use(errorHandler);

module.exports = app;
