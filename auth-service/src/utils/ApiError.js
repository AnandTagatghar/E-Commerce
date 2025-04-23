class ApiError extends Error {
  constructor(
    statusCode,
    message = `Something went wrong`,
    errors = [],
    stack = ""
  ) {
    super(message);

    this.status = false;
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.data = null;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;