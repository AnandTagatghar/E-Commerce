const ApiError = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: err.status,
      statusCode: err.statusCode,
      message: err.message || "Something went wrong",
      errors: err.errors,
      data: err.data || null,
    });
  }

  return res
    .status(err?.response?.data?.statusCode || err.statusCode || 500)
    .json({
      status: false,
      statusCode: err?.response?.data?.statusCode || err.statusCode || 500,
      message:
        err?.response?.data?.message || err.message || "Internal Server Error",
      errors: [err.message || "Something went wrong"],
      data: null,
    });
};

module.exports = errorHandler;
