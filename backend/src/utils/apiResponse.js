class ApiResponse {
  constructor(message = "Request completed successfully.", data = {}, status = 200) {
    this.success = true;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
    this.errors = null;
    this.status = status;
  }

  send(res) {
    return res.status(this.status).json({
      success: this.success,
      message: this.message,
      data: this.data,
      timestamp: this.timestamp,
      errors: this.errors
    });
  }

  static success(res, message = "Request completed successfully.", data = {}, status = 200) {
    return new ApiResponse(message, data, status).send(res);
  }
}

module.exports = ApiResponse;
