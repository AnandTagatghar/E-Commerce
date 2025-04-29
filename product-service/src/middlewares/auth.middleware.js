const asyncHandler = require("../utils/asyncHandler");
const axios = require("axios");
const logger = require("../config/logger");

const verifyUser = asyncHandler(async (req, res, next) => {
  try {
    logger.info(`Verify usre middleware got hitted`);
    let response = await axios.get(
      `${process.env.USER_SERVICE_URI}/get-user-details`,
      {
        headers: {
          Cookie: Object.entries(req.cookies)
            .map(([key, value]) => `${key}=${value}`)
            .join("; "),
        },
      }
    );

    if (response.data.status) {
      req.user = response.data.data;
      next();
    } else {
      logger.info(`verify user service call response is false`);
      throw new ApiError(response.data.statusCode, response.data.message);
    }
  } catch (error) {
    logger.error(`Error in verify user middleware: ${error.message}`);
    next(error);
  }
});

module.exports = { verifyUser };
