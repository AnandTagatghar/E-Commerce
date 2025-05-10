const axios = require("axios");
const logger = require("../config/logger");
const ApiError = require("../utils/ApiError");

const verifyUser = async (req, res, next) => {
  try {
    logger.info(`Verify user middleware got hitted`);
    if (!req.cookies) throw new ApiError(401, `Unauthorized`);
    const { accessToken } = req.cookies;
    if (!accessToken) throw new ApiError(401, `Unauthorized`);

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
      logger.error(`Response from user details endpoint is failed`);
      throw new ApiError(response.data.statusCode, response.data.message);
    }
  } catch (error) {
    logger.error(`Error at verify user middlerware: ${error.message}`);
    next(error);
  }
};

module.exports = verifyUser;
