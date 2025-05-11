const ApiError = require("../utils/ApiError");

const errorHandler = (error, req, res, next) => {
  if (error instanceof ApiError) {
    return res
      .status(error?.response?.data.statusCode || error.statusCode)
      .json({
        status: false,
        statusCode:
          error?.response?.data?.statusCode || error?.statusCode || 500,
        message:
          error?.response?.data?.message ||
          error?.message ||
          `Something went wrong`,
        errors: error.errors,
      });
  }

  return res.status(error?.response?.data.statusCode || error.statusCode).json({
    status: false,
    statusCode: error?.response?.data?.statusCode || error?.statusCode || 500,
    message:
      error?.response?.data?.message ||
      error?.message ||
      `Something went wrong`,
    errors: error.errors,
  });
};

module.exports = errorHandler;
