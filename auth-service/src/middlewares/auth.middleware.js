const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const Auth = require("../models/auth.model");
const logger = require("../config/logger");
const asyncHandler = require("../utils/asyncHandler");

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    logger.info(`VerifyJWT middleware hitted`);
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

    req.user = user;
    next();
  } catch (error) {
    logger.error(`Error at auth service verifyJWT: ${error.message}`);
    next(error);
  }
});

module.exports = { verifyJWT };
