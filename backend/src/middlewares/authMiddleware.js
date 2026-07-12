const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');
const User = require('../models/User');

/**
 * Middleware to authenticate requests via JWT tokens passed in Authorization header or Cookies.
 */
const authenticateUser = async (req, res, next) => {
  let token;

  // Read Bearer token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ApiError('Authentication required. Missing token.', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'TransitOpsSuperSecretKeyForJWTAuth2026!');

    // Fetch user from DB and verify status
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ApiError('User associated with this token does not exist.', 401));
    }

    if (user.status === 'Suspended') {
      return next(new ApiError('Access forbidden. Your account has been suspended.', 403));
    }
    if (user.status === 'Inactive') {
      return next(new ApiError('Access forbidden. Your account is inactive.', 403));
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError('Authentication failed. Invalid or expired token.', 401));
  }
};

/**
 * Middleware to restrict endpoint access to specific roles.
 * @param {...string} roles - List of allowed roles
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError('User context missing from request.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(`Access denied. Role '${req.user.role}' is not authorized to access this resource.`, 403));
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeRoles };
