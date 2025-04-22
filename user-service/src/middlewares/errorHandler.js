const ApiError = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: err.status,
      statusCode: err.statusCode,
      message: err.message || "Something went wrong",
      errors: err.errors || [],
      data: err.data || null,
    });
  }

  return res.status(500).json({
    status: false,
    statusCode: 500,
    message: "Internal Server Error",
    errors: [err.message || "Unexpected error occurred"],
    data: null,
  });
};

module.exports = errorHandler;
