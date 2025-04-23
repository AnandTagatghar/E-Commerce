const experss = require("express");
const { authRouter } = require("./routers/auth.router");
const errorHandler = require("./middlewares/errorHandler.middleware");
const cookieParser = require("cookie-parser");

const app = experss();

app.use(experss.json());
app.use(experss.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth-service", authRouter);

app.use(errorHandler);

module.exports = app;
