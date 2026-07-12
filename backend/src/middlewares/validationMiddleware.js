const { validationResult } = require('express-validator');
const ApiError = require('../utils/apiError');

/**
 * Middleware to intercept express-validator validation results.
 * If validation fails, it throws a standard ApiError that is formatted by errorMiddleware.
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Forward express-validator errors array
    return next(new ApiError('Validation Failed', 400, errors.array()));
  }
  next();
};

module.exports = validateRequest;
