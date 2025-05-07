const express = require("express");
const cookie_parser = require("cookie-parser");
const errorHandler = require("./middlewares/errorHandler.middleware");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie_parser());

app.use(errorHandler);
module.exports = app;
