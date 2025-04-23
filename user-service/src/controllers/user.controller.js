const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { putObjectURL } = require("../utils/signedURLs");
const logger = require("../config/logger");

const registerUser = asyncHandler(async (req, res, next) => {
  try {
    logger.info(`registerUser controller got hitted`);

    if (req.body == undefined) {
      throw new ApiError(400, `Required fields are missing`);
    }

    const { username, fullName, email, profilePic, role } = req.body;

    if (
      !username ||
      role == undefined ||
      !fullName ||
      !email ||
      profilePic == undefined ||
      role == undefined
    ) {
      throw new ApiError(400, `Required fields are missing`);
    }

    let user = await User.findByPk(email);

    if (user) throw new ApiError(409, `Email already registered`);

    let uploadProfilePic;

    if (profilePic) {
      uploadProfilePic = await putObjectURL("jpeg");
    }

    user = await User.create({
      username,
      fullname: fullName,
      email,
      role,
      ...(profilePic
        ? {
            profilePicURL: uploadProfilePic.signedURL,
            profilePicKey: uploadProfilePic.key,
          }
        : {}),
    });

    res
      .status(200)
      .json(new ApiResponse(200, `User registered successfully`, user));
  } catch (error) {
    logger.error(`Error in registering user: ${error.message}`);
    next(error);
  }
});

module.exports = {
  registerUser,
};
