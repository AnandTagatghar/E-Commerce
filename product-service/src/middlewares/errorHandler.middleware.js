const ApiError = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: err.status,
      statusCode: err.statusCode,
      message: err.message || `Something went wrong`,
      errors: err.errors,
    });
  }
  return res.status(err.statusCode || 500).json({
    status: err.status || false,
    statusCode: err?.response?.data?.statusCode || err.statusCode || 500,
    message:
      err?.response?.data?.message || err.message || `Something went wrong`,
    errors: [err.message || `Unexpected error occurred`] || [],
  });
};

module.exports = errorHandler;
