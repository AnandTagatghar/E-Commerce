const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const axios = require("axios");
const logger = require("../config/logger");

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    logger.info(`Verify jwt token middleware hitted`);
    let response = await axios.get(
      `${process.env.AUTH_SERVICE_URI}/verify-token-call`,
      {
        headers: {
          Cookie: Object.entries(req.cookies)
            .map(([key, val]) => `${key}=${val}`)
            .join("; "),
        },
      }
    );

    if (response.data.status) {
      req.user = response.data.data;
      next();
    } else {
      throw new ApiError(response.data.statusCode, response.data.message);
    }
  } catch (error) {
    logger.error(`Error at verify jwt middleware: ${error.message}`);
    console.log(error);
    next(error);
  }
});

module.exports = { verifyJWT };
