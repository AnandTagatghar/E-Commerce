const express = require("express");
const {
  registerUser,
  deleteYourAccount,
  uploadProfilePicURL,
  deleteUserAccount,
  updateUserDetails,
  updateUserRole,
  getProfilePicURL,
} = require("../controllers/user.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = express.Router();

router.route("/register-user").post(registerUser);
router.route("/delete-account").delete(deleteYourAccount);
router.route("/upload-profile-pic-url").get(verifyJWT, uploadProfilePicURL);

router.route("/delete-user-account").delete(deleteUserAccount);

router.route("/update-user-details").patch(verifyJWT, updateUserDetails);

router.route("/update-user-role").patch(verifyJWT, updateUserRole);

router.route("/get-profile-pic-url").get(verifyJWT, getProfilePicURL);

module.exports = {
  userRouter: router,
};
