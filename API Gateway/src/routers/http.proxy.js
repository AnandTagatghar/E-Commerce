const { createProxyMiddleware } = require("http-proxy-middleware");

const userService = createProxyMiddleware({
  target: process.env.USER_SERVICE_TARGET,
  changeOrigin: true,
  pathRewrite: {
    "^/users": "",
  },
});

module.exports = {
  userService,
};
