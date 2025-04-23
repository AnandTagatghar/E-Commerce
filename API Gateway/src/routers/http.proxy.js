const proxy = require("express-http-proxy");

const userServiceProxy = proxy(process.env.USER_SERVICE_TARGET, {
  proxyReqPathResolver: (req) => {
    console.log(`Proxying request to: /api/v1/user-service${req.url}`);
    return `/api/v1/user-service${req.url}`;
  },

  proxyReqBodyDecorator: (bodyContent, srcReq) => {
    console.log("Request body:", bodyContent);
    return bodyContent;
  },

  userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
    console.log("Response status:", proxyRes.statusCode);
    return proxyResData;
  },
});

const authServiceProxy = proxy(process.env.AUTH_SERVICE_TARGET, {
  proxyReqPathResolver: (req) => {
    console.log(`Proxying request to: /api/v1/auth-service${req.url}`);
    return `/api/v1/auth-service${req.url}`;
  },

  proxyReqBodyDecorator: (bodyContent, srcReq) => {
    console.log("Request body:", bodyContent);
    return bodyContent;
  },

  userResDecorator: (proxyRes, proxyResData, authReq, authRes) => {
    console.log("Response status:", proxyRes.statusCode);
    return proxyResData;
  },
});

module.exports = {
  userServiceProxy,
  authServiceProxy
};
