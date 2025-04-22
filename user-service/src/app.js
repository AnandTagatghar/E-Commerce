const express = require("express");
const cookieParser = require("cookie-parser");
const { userRouter } = require("./routers/user.router");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/user-service", userRouter);

app.use(errorHandler);

module.exports = app;
