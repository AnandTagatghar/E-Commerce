const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { putObjectURL } = require("../utils/signedURLs");
const logger = require("../config/logger");

const registerUser = asyncHandler(async (req, res) => {
  try {
    logger.info(`registerUser controller got hitted`);

    if (req.body == undefined) {
      res.status(400).json(new ApiError(400, `Required fields are missing`));
    }

    const { username, fullName, email, profilePic } = req.body;

    if (!username || !fullName || !email || profilePic == undefined) {
      res.status(400).json(new ApiError(400, `Required fields are missing`));
    }

    let user = await User.findByPk(email);

    if (user)
      res.status(409).json(new ApiError(409, `Email already registered`));

    let uploadProfilePic;

    if (profilePic) {
      uploadProfilePic = await putObjectURL("jpeg");
    }

    user = await User.create({
      username,
      fullname: fullName,
      email,
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

    res
      .status(error.statusCode || 500)
      .json(new ApiError(error.statusCode || 500, error.message || `${error}`));
  }
});

module.exports = {
  registerUser,
};
