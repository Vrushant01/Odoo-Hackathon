const authService = require('../services/authService');
const ApiResponse = require('../utils/apiResponse');

/**
 * Handle user authentication and return session JWT.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await authService.login(email, password);

    // Set cookie options
    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    };

    res.cookie('token', token, cookieOptions);

    return ApiResponse.success(res, 'Login successful.', { token, user });
  } catch (error) {
    next(error);
  }
};

/**
 * Log out user by clearing the session cookie.
 */
const logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 5000),
      httpOnly: true
    });
    return ApiResponse.success(res, 'Logged out successfully.', {});
  } catch (error) {
    next(error);
  }
};

/**
 * Get current logged in user details.
 */
const getMe = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    return ApiResponse.success(res, 'Current user profile loaded successfully.', user);
  } catch (error) {
    next(error);
  }
};

/**
 * Update current user profile attributes (fullName, phone, profileImage).
 */
const updateProfile = async (req, res, next) => {
  try {
    // If a profile image was uploaded, save relative path to db
    if (req.file) {
      req.body.profileImage = `/uploads/profiles/${req.file.filename}`;
    }
    
    const user = await authService.updateProfile(req.user.id, req.body);
    return ApiResponse.success(res, 'Profile details updated successfully.', user);
  } catch (error) {
    next(error);
  }
};

/**
 * Update current user password.
 */
const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    await authService.changePassword(req.user.id, oldPassword, newPassword);
    return ApiResponse.success(res, 'Password changed successfully.', {});
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  logout,
  getMe,
  updateProfile,
  changePassword
};
