const ApiError = require("../utils/ApiError");

const errorHandler = (error, req, res, next) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      status: error.status,
      statusCode: error.statusCode,
      message: error.message || `Something went wrong`,
      errors: error.errors,
    });
  }

  return res.status(error.statusCode || 500).json({
    status: error.status ||false,
    statusCode: error?.response?.data?.message || error.statusCode || 500,
    message:
      error?.response?.data?.message ||
      error?.message ||
      `Something went wrong`,
    errors: [error.message || `Unexpected error occurred`] || [],
  });
};

module.exports = errorHandler;
