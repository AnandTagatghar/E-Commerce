const { Router } = require("express");
const {
  registerAuth,
  loginAuth,
  refreshAccessTokenAuth,
  logoutUser,
  deleteYourAccount,
  changePassword,
  verifyJWTCall,
  deleteUserAccount,
} = require("../controllers/auth.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");
const router = Router();

router.route("/register-user").post(registerAuth);
router.route("/login-user").post(loginAuth);
router.route("/refresh-access-token").get(refreshAccessTokenAuth);

router.route("/logout-user").get(verifyJWT, logoutUser);

router.route("/delete-account").delete(verifyJWT, deleteYourAccount);

router.route("/change-password").patch(verifyJWT, changePassword);

router.route("/verify-token-call").get(verifyJWTCall);

router.route("/delete-user-account").delete(verifyJWT, deleteUserAccount);

module.exports = {
  authRouter: router,
};
