const axios = require("axios");
const ApiError = require("../utils/ApiError");
const logger = require("../config/logger");

const verifyUser = async (req, res, next) => {
  try {
    logger.info(`Verify user middleware got hit`);
    if (!req.cookies) {
      return next(new ApiError(401, "Unauthorized"));
    }
    const { accessToken } = req.cookies;
    if (!accessToken) {
      return next(new ApiError(401, "Unauthorized"));
    }

    let response = await axios.get(
      `${process.env.USER_SERVICE_URL}/get-user-details`,
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
};

module.exports = verifyUser;
