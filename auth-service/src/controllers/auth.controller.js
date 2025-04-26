const jwt = require("jsonwebtoken");
const logger = require("../config/logger");
const Auth = require("../models/auth.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const axios = require("axios");

const registerAuth = asyncHandler(async (req, res, next) => {
  let user;
  try {
    logger.info(`Register auth controller got hitted`);
    if (!req.body) throw new ApiError(400, `Required fields are missing`);
    const { email, password, username, fullName, profilePic, role } = req.body;
    if (
      !email ||
      !password ||
      !username ||
      !fullName ||
      profilePic == undefined ||
      role == undefined
    )
      throw new ApiError(400, `Required fields are missing`);
    user = await Auth.findByPk(email);
    if (user) throw new ApiError(409, `Email already registered`);
    user = await Auth.create({
      email,
      password,
    });

    let refreshToken = user.generateRefreshToken();
    let accessToken = user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save();

    user = user.get({ plain: true });

    let registerOnUserService = await axios.post(
      `${process.env.USER_SERVICE_URI}/register-user`,
      {
        username,
        fullName,
        email,
        profilePic,
        role,
      }
    );
    if (registerOnUserService.status) {
      logger.info(`User register success on user-service`);

      registerOnUserService.data.data.refreshToken = refreshToken;
      registerOnUserService.data.data.accessToken = accessToken;

      res
        .status(200)
        .cookie("refreshToken", refreshToken)
        .cookie("accessToken", accessToken)
        .json(registerOnUserService.data);
    } else {
      await Auth.destroy({ where: { email: user.email } });
      logger.error(`User register failed and row removed on auth-service`);
      res.status(registerOnUserService.status).json(registerOnUserService.data);
    }
  } catch (error) {
    if (user) {
      await Auth.destroy({ where: { email: user.email } });
      await axios.delete(`${process.env.USER_SERVICE_URI}/delete-user`, {
        data: {
          email: user.email,
        },
      });
    }

    logger.error(`Something went wrong on register auth: ${error.message}`);
    next(error);
  }
});

const loginAuth = asyncHandler(async (req, res, next) => {
  try {
    logger.info(`loginAuth controller hitted`);
    if (!req.body) throw new ApiError(400, `Required fields are missing`);

    const { email, password } = req.body;

    if (!email || !password)
      throw new ApiError(400, `Required fiels are missing`);

    let user = await Auth.findByPk(email);

    if (!user) throw new ApiError(404, `Incorrect username or password`);

    if (!(await user.isPasswordCorrect(password)))
      throw new ApiError(401, `Incorrect username or password`);

    let refreshToken = user.generateRefreshToken();
    let accessToken = user.generateAccessToken();

    user = user.get({ plain: true });

    delete user.password;

    res
      .status(200)
      .cookie("refreshToken", refreshToken)
      .cookie("accessToken", accessToken)
      .json(
        new ApiResponse(200, { ...user, ...{ refreshToken, accessToken } })
      );
  } catch (error) {
    logger.error(`Error in login controller: ${error.message}`);
    next(error);
  }
});

const refreshAccessTokenAuth = asyncHandler(async (req, res, next) => {
  try {
    logger.info(`refreshAccessTokenAuth controller hitted`);
    if (!req.cookies)
      throw new ApiError(401, `Authentication cookie is missing or invalid`);

    if (!req.cookies.refreshToken)
      throw new ApiError(401, `Authentication cookie is missing or invalid`);

    let token = jwt.verify(
      req.cookies.refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY
    );

    if (!token) throw new ApiError(401, `Invalid authentication token`);

    let user = await Auth.findByPk(token.email);

    if (!user) throw new ApiError(409, `Unauthorized user`);

    let accessToken = user.generateAccessToken();

    res
      .status(200)
      .cookie("accessToken", accessToken)
      .json(
        new ApiResponse(200, `Refresh access token success`, { accessToken })
      );
  } catch (error) {
    logger.error(`Error on refresh access token auth: ${error.message}`);
    next(error);
  }
});

const logoutUser = asyncHandler(async (_, res, next) => {
  try {
    logger.info(`logout user controller hitted`);
    res
      .cookie("refreshToken", "")
      .cookie("accessToken", "")
      .json(new ApiResponse(200, `Logout success`));
  } catch (error) {
    logger.error(`Error in logout user controller: ${error}`);
    next(error);
  }
});

const deleteYourAccount = asyncHandler(async (req, res, next) => {
  try {
    logger.info(`delete your account controller got hitted`);
    const response_from_user_service = await axios.delete(
      `${process.env.USER_SERVICE_URI}/delete-account`,
      {
        data: {
          email: req.user.email,
        },
      }
    );

    if (response_from_user_service.data.status) {
      await Auth.destroy({ where: { email: req.user.email } });

      res
        .status(200)
        .json(
          new ApiResponse(200, `${req.user.email} account deleted successfully`)
        );
    } else {
      throw new ApiError(
        response_from_user_service.data.statusCode,
        response_from_user_service.data.message
      );
    }
  } catch (error) {
    logger.error(`Error in delete_your_account controller: ${error.message}`);
    next(error);
  }
});

const changePassword = asyncHandler(async (req, res, next) => {
  try {
    logger.info(`Change password controller hitted`);
    if (!req.body) throw new ApiError(404, `Required fields are missing`);

    const { old_password, password, confirm_password } = req.body;

    if (!old_password || !password || !confirm_password)
      throw new ApiError(400, `Required fields are missing`);

    if (password !== confirm_password)
      throw new ApiError(400, `Password and confirm password do not match`);

    let user_data = await Auth.findByPk(req.user.email);

    if (!(await user_data.isPasswordCorrect(old_password)))
      throw new ApiError(401, `Incorrect old password`);

    user_data.password = password;
    await user_data.save();

    res.status(200).json(new ApiResponse(200, `Password updated successfully`));
  } catch (error) {
    logger.error(`Error in change password auth controller: ${error.message}`);
    next(error);
  }
});

const verifyJWTCall = asyncHandler(async (req, res, next) => {
  try {
    logger.info(`VerifyJWTCall controller hitted`);
    if (!req.cookies)
      throw new ApiError(401, `Authentication cookie is missing or invalid.`);

    if (!req.cookies.accessToken)
      throw new ApiError(401, `Authentication cookie is missing or invalid`);

    let user = jwt.verify(
      req.cookies.accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY
    );

    if (!user) throw new ApiError(401, `Invalid authentication token`);

    user = await Auth.findByPk(user.email);

    if (!user) throw new ApiError(409, `Unauthorized user`);

    user = user.get({ plain: true });

    delete user.password;

    res.status(200).json(new ApiResponse(200, `verification success`, user));
  } catch (error) {
    logger.error(`Error at auth service verifyJWT: ${error.message}`);
    next(error);
  }
});

const deleteUserAccount = asyncHandler(async (req, res, next) => {
  try {
    logger.info(`delete user account controller got hitted`);

    if (!req.body) throw new ApiError(400, `Required fields are missing`);
    const { email } = req.body;
    if (!email) throw new ApiError(400, `Requried fields are missing`);

    const response_from_user_service = await axios.delete(
      `${process.env.USER_SERVICE_URI}/delete-user-account`,
      {
        data: {
          email: req.user.email,
          user_email: email,
        },
      }
    );

    if (response_from_user_service.data.status) {
      await Auth.destroy({ where: { email: req.user.email } });

      res
        .status(200)
        .json(
          new ApiResponse(200, `${req.user.email} account deleted successfully`)
        );
    } else {
      throw new ApiError(
        response_from_user_service.data.statusCode,
        response_from_user_service.data.message
      );
    }
  } catch (error) {
    logger.error(`Error in delete_your_account controller: ${error.message}`);
    next(error);
  }
});

module.exports = {
  registerAuth,
  loginAuth,
  refreshAccessTokenAuth,
  logoutUser,
  deleteYourAccount,
  changePassword,
  verifyJWTCall,
  deleteUserAccount
};
