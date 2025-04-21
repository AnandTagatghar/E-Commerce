const { userService } = require("./routers/http.proxy");

const express = require("express");

const app = express();

app.use("/users", userService);

module.exports = app;