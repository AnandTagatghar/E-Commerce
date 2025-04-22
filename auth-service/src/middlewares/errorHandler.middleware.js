const ApiError = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: err.status,
      statusCode: err.statusCode,
      message: err.message || `Something went wrong`,
      data: err.data || null,
      errors: err.errors || [],
    });
  }

  return res.status(500).json({
    status: false,
    statusCode: 500,
    message: `Internal server error`,
    data: null,
    errors: [err.message || `Unexpected error occurred`],
  });
};

module.exports = errorHandler;
