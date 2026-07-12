const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const ApiError = require('../utils/apiError');

class AuthService {
  /**
   * Authenticate a user by email and password.
   * @param {string} email - Email address
   * @param {string} password - Plain text password
   */
  async login(email, password) {
    // Retrieve user and force include the password field
    const user = await userRepository.findByEmail(email, true);
    
    if (!user) {
      throw new ApiError('Invalid email or password', 401);
    }

    // Validate password match
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new ApiError('Invalid email or password', 401);
    }

    // Check account status
    if (user.status === 'Suspended') {
      throw new ApiError('Your account has been suspended. Please contact admin.', 403);
    }
    if (user.status === 'Inactive') {
      throw new ApiError('Your account is currently inactive.', 403);
    }

    // Record last login time
    user.lastLogin = new Date();
    await user.save();

    const token = this.generateToken(user);

    // Prepare clean user object for client response
    const userObj = user.toObject();
    delete userObj.password;

    return { token, user: userObj };
  }

  /**
   * Generate JWT signature for user session.
   * @param {Object} user - User document
   */
  generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'TransitOpsSuperSecretKeyForJWTAuth2026!',
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );
  }

  /**
   * Retrieve the profile of the currently logged-in user.
   * @param {string} userId - User ID
   */
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    return user;
  }

  /**
   * Update the profile of the current user.
   * @param {string} userId - User ID
   * @param {Object} updateData - Key/value pairs to update
   */
  async updateProfile(userId, updateData) {
    const allowedUpdates = {};
    if (updateData.fullName) allowedUpdates.fullName = updateData.fullName;
    if (updateData.phoneNumber) allowedUpdates.phoneNumber = updateData.phoneNumber;
    if (updateData.profileImage) allowedUpdates.profileImage = updateData.profileImage;

    const user = await userRepository.update(userId, allowedUpdates);
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    return user;
  }

  /**
   * Change user password.
   * @param {string} userId - User ID
   * @param {string} oldPassword - Current password
   * @param {string} newPassword - Target new password
   */
  async changePassword(userId, oldPassword, newPassword) {
    const user = await userRepository.findById(userId, true);
    if (!user) {
      throw new ApiError('User not found', 404);
    }

    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      throw new ApiError('Incorrect current password.', 400);
    }

    user.password = newPassword;
    await user.save();
    return true;
  }
}

module.exports = new AuthService();
