const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const {
  putObjectURL,
  getObjectURL,
  deleteObject,
} = require("../utils/signedURLs");
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

    console.log(role);

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

const deleteYourAccount = asyncHandler(async (req, res, next) => {
  try {
    logger.info(`delete user controller hitted`);
    if (!req.body) throw new ApiError(400, `Required fields are missing`);
    const { email } = req.body;
    if (!email) throw new ApiError(400, `Required fields are missing`);

    const user = await User.findByPk(email);

    if (!user) throw new ApiError(404, `User not found`);

    if (user.role != "admin")
      throw new ApiError(403, `Access denied. Admin privileges required`);

    await User.destroy({
      where: {
        email,
      },
    });

    res.status(200).json(new ApiResponse(200, `${email} deleted successfully`));
  } catch (error) {
    logger.error(`Error at delete user controller: ${error.message}`);
    next(error);
  }
});

const uploadProfilePicURL = asyncHandler(async (req, res, next) => {
  try {
    logger.info(`Upload profile pic url controller hitted`);
    if (!req.body) throw new ApiError(404, `Requried fields are missing`);

    const { profilePic } = req.body;

    if (!profilePic) throw new ApiError(400, `Required fields are missing`);

    let user = await User.findByPk(req.user.email);

    if (!user) throw new ApiError(404, `User not found`);

    let response = await deleteObject(user.profilePicKey);

    let { signedURL: profilePicURL, key: profilePicKey } = await putObjectURL(
      "jpeg"
    );

    if (!profilePicURL || !profilePicKey)
      throw new ApiError(
        500,
        `Failed to upload picture. Please try again later`
      );

    user.profilePicURL = profilePicURL;
    user.profilePicKey = profilePicKey;

    await user.save();

    user = user.get({ plain: true });

    res.status(200).json(
      new ApiResponse(200, `Use this URL to update profile pic`, {
        profilePicURL,
      })
    );
  } catch (error) {
    logger.error(`Error at upload profile pic controller: ${error.message}`);
    next(error);
  }
});

const deleteUserAccount = asyncHandler(async (req, res, next) => {
  try {
    logger.info(`delete user controller hitted`);
    if (!req.body) throw new ApiError(400, `Required fields are missing`);
    const { user_email, email } = req.body;
    if (!user_email || !email)
      throw new ApiError(400, `Required fields are missing`);

    if (user_email == email)
      throw new ApiError(
        400,
        `Cannot delete user. Provided email matches the current user's email`
      );

    const user = await User.findByPk(user_email);

    if (!user) throw new ApiError(404, `User not found`);

    if (!user.isAdmin())
      throw new ApiError(403, `Access denied. Admin privileges required`);

    await User.destroy({
      where: {
        email,
      },
    });

    res.status(200).json(new ApiResponse(200, `${email} deleted successfully`));
  } catch (error) {
    logger.error(`Error at delete user controller: ${error.message}`);
    next(error);
  }
});

const updateUserDetails = asyncHandler(async (req, res, next) => {
  try {
    logger.info(`Update user details controller got hitted`);

    if (!req.body) throw new ApiError(400, `Required fields are missing`);

    const { username, fullname } = req.body;

    if (!username || !fullname)
      throw new ApiError(400, `Required fields are missing`);

    let user = await User.findByPk(req.user.email);

    if (!user) throw new ApiError(404, `User not found`);

    user.username = username;
    user.fullname = fullname;

    await user.save();

    user = user.get({ plain: true });

    delete user.password;
    delete user.profilePicKey;
    delete user.role;

    res
      .status(200)
      .json(new ApiResponse(200, `Updating user details success`, user));
  } catch (error) {
    logger.error(`Error in update user detials controller: ${error.message}`);
    next(error);
  }
});

const updateUserRole = asyncHandler(async (req, res, next) => {
  try {
    logger.info(`Update user role controller hitted`);

    if (!req.body) throw new ApiError(400, `Required fields are missing`);
    const { email, role } = req.body;
    if (!email || !role) throw new ApiError(400, `Required fields are missing`);

    if (email == req.user.email)
      throw new ApiError(
        400,
        `Cannot update user role. Provided email matches the current user's email`
      );

    let user = await User.findByPk(req.user.email);

    if (!user) throw new ApiError(404, `User not found`);

    if (!user.isAdmin())
      throw new ApiError(403, `Access denied. Admin privileges required`);

    user.role = role;
    await user.save();

    user = user.get({ plain: true });

    delete user.password;
    delete user.profilePicKey;

    res
      .status(200)
      .json(new ApiResponse(200, `User role updated successfully`, user));
  } catch (error) {
    logger.error(`Error in update user role controller: ${error.message}`);
    next(error);
  }
});

const getProfilePicURL = asyncHandler(async (req, res, next) => {
  try {
    logger.info(`Get profile pic url controller got hitted`);
    let user = await User.findByPk(req.user.email);

    if (!user) throw new ApiError(404, `User not found`);

    let profile_url = await getObjectURL(user.profilePicKey);

    res
      .status(200)
      .json(new ApiResponse(200, `Profile pic url fetched`, { profile_url }));
  } catch (error) {
    logger.error(`Error in get profile pic url controller: ${error.message}`);
    next(error);
  }
});

module.exports = {
  registerUser,
  deleteYourAccount,
  uploadProfilePicURL,
  deleteUserAccount,
  updateUserDetails,
  updateUserRole,
  getProfilePicURL,
};
