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
    const { email, password, username, fullName, profilePic } = req.body;
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

    let refreshToken = user.generateAccessToken();
    let accessToken = user.generateRefreshToken();

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
      }
    );
    if (registerOnUserService.status) {
      logger.info(`User register success on user-service`);
      res
        .status(200)
        .cookie("refreshToken", refreshToken)
        .cookie("accessToken", accessToken)
        .json({
          ...registerOnUserService.data,
          ...{ refreshToken, accessToken },
        });
    } else {
      await Auth.destroy({ where: { email: user.email } });
      logger.error(`User register failed and row removed on auth-service`);
      res.status(registerOnUserService.status).json(registerOnUserService.data);
    }
  } catch (error) {
    if (user) {
      await Auth.destroy({ where: { email: user.email } });
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

const logoutUser = asyncHandler(async (req, res, next) => {
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

module.exports = {
  registerAuth,
  loginAuth,
  refreshAccessTokenAuth,
  logoutUser,
};
