class ApiResponse {
  constructor(statusCode, message, data) {
    this.status = true;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
module.exports = ApiResponse;
