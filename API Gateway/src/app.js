require("dotenv").config();

const express = require("express");
const { userServiceProxy } = require("./routers/http.proxy");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", userServiceProxy);

module.exports = app;
