require("dotenv").config();

const express = require("express");
const { userServiceProxy, authServiceProxy } = require("./routers/http.proxy");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user-service", userServiceProxy);
app.use("/api/v1/auth-service", authServiceProxy);

module.exports = app;
