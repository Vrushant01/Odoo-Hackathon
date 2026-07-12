const ApiError = require('../utils/apiError');
const logger = require('../utils/logger');

const errorMiddleware = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error details
  logger.error(`${req.method} ${req.originalUrl} - ${err.stack || err.message}`);

  // 1. Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with ID of ${err.value}`;
    error = new ApiError(message, 404);
  }

  // 2. Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const key = Object.keys(err.keyValue)[0];
    const message = `A record with this ${key} already exists.`;
    error = new ApiError(message, 400);
  }

  // 3. Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const errorsList = Object.keys(err.errors).map((key) => ({
      field: key,
      message: err.errors[key].message
    }));
    error = new ApiError('Validation Failed', 400, errorsList);
  }

  // 4. JWT Errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError('Invalid authentication token.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    error = new ApiError('Authentication token has expired.', 401);
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  
  // Format errors array to match contract: [{ field, message }]
  let formattedErrors = null;
  if (error.errors && Array.isArray(error.errors)) {
    formattedErrors = error.errors.map(errObj => ({
      field: errObj.path || errObj.param || errObj.field || '',
      message: errObj.msg || errObj.message || ''
    }));
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: formattedErrors
  });
};

module.exports = errorMiddleware;
