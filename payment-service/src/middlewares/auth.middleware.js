const logger = require("../config/logger");
const ApiError = require("../utils/ApiError");
const asyncHandlers = require("../utils/asyncHandlers");
const axios = require("axios");

const verifyUser = asyncHandlers(async (req, res, next) => {
  try {
    logger.info(`Verify user middleware got hitted`);

    if (!req.cookies)
      throw new ApiError(401, `Required cookie not found in request`);
    const { accessToken } = req.cookies;
    if (!accessToken)
      throw new ApiError(401, `Required cookie not found in request`);

    let user_response = await axios.get(
      `${process.env.USER_SERVICE_URI}/get-user-details`,
      {
        headers: {
          Cookie: Object.entries(req.cookies)
            .map(([key, value]) => `${key}=${value}`)
            .join("; "),
        },
      }
    );

    if (!user_response.data.status)
      throw new ApiError(
        user_response.data.statusCode,
        user_response.data.message
      );

    req.user = user_response.data.data;
    next();
  } catch (error) {
    logger.error(`Error on verify user middleware: ${error.message}`);
    next(error);
  }
});

module.exports = verifyUser;
