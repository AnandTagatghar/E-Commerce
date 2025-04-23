const { Router } = require("express");
const {
  registerAuth,
  loginAuth,
  refreshAccessTokenAuth,
  logoutUser,
} = require("../controllers/auth.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");
const router = Router();

router.route("/register-user").post(registerAuth);
router.route("/login-user").post(loginAuth);
router.route("/refresh-access-token").get(refreshAccessTokenAuth);

router.route("/logout-user").get(verifyJWT,logoutUser);

module.exports = {
  authRouter: router,
};
