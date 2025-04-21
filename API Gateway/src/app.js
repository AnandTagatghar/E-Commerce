const { createProxyMiddleware } = require("http-proxy-middleware");
const { userService } = require("./routers/http.proxy");
const bodyParser = require("body-parser");

const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.text({ type: "*/*" }));

app.use("/api/v1", userService);

module.exports = app;
