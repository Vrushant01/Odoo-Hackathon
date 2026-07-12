const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const ApiError = require('../utils/apiError');
const User = require('../models/User');
const notificationService = require('./notificationService');
const auditService = require('./auditService');

function parseUserAgent(userAgent) {
  if (!userAgent) return { browser: 'Unknown', os: 'Unknown' };
  
  let os = 'Unknown OS';
  if (userAgent.indexOf('Win') !== -1) os = 'Windows';
  else if (userAgent.indexOf('Mac') !== -1) os = 'macOS';
  else if (userAgent.indexOf('X11') !== -1) os = 'UNIX';
  else if (userAgent.indexOf('Linux') !== -1) os = 'Linux';
  else if (userAgent.indexOf('Android') !== -1) os = 'Android';
  else if (userAgent.indexOf('iPhone') !== -1 || userAgent.indexOf('iPad') !== -1) os = 'iOS';

  let browser = 'Unknown Browser';
  if (userAgent.indexOf('Chrome') !== -1) browser = 'Chrome';
  else if (userAgent.indexOf('Safari') !== -1) browser = 'Safari';
  else if (userAgent.indexOf('Firefox') !== -1) browser = 'Firefox';
  else if (userAgent.indexOf('MSIE') !== -1 || userAgent.indexOf('Trident') !== -1) browser = 'IE';
  else if (userAgent.indexOf('Edge') !== -1) browser = 'Edge';

  return { browser, os };
}

class AuthService {
  /**
   * Authenticate a user by email and password.
   * @param {string} email - Email address
   * @param {string} password - Plain text password
   * @param {string} ipAddress - IP Address of the requester
   * @param {string} userAgentStr - User Agent string of the requester
   */
  async login(email, password, ipAddress = '', userAgentStr = '') {
    // Retrieve user and force include the password field
    const user = await userRepository.findByEmail(email, true);
    
    if (!user) {
      // Log audit for non-existent email
      await auditService.log(
        null,
        'Failed Login',
        'Auth',
        null,
        { email },
        ipAddress,
        userAgentStr,
        null
      );
      throw new ApiError('Invalid email or password', 401);
    }

    // Check account lockout first
    if (user.account_locked) {
      await auditService.log(
        user._id,
        'Failed Login',
        'Auth',
        null,
        { reason: 'Account Locked' },
        ipAddress,
        userAgentStr,
        user._id
      );
      throw new ApiError('Your account has been locked due to multiple failed login attempts. Please contact an administrator.', 403);
    }

    // Validate password match
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      user.failed_attempts = (user.failed_attempts || 0) + 1;
      user.last_failed_login = new Date();

      await auditService.log(
        user._id,
        'Failed Login',
        'Auth',
        null,
        { failed_attempts: user.failed_attempts },
        ipAddress,
        userAgentStr,
        user._id
      );

      if (user.failed_attempts >= 5) {
        user.account_locked = true;
        user.locked_at = new Date();
        user.locked_by = null;
        
        // Log account lockout
        await auditService.log(
          null, // performed by system/self
          'Account Locked',
          'Auth',
          null,
          { reason: '5 failed login attempts' },
          ipAddress,
          userAgentStr,
          user._id
        );

        // Notify administrators
        const admins = await User.find({ role: { $in: ['Super Admin', 'Fleet Manager'] } });
        const { browser, os } = parseUserAgent(userAgentStr);
        const timeStr = new Date().toLocaleString();
        
        for (const admin of admins) {
          await notificationService.createNotification(
            admin._id,
            'Account Locked',
            'Account Locked',
            `${user.fullName} has been locked after 5 failed login attempts. Email: ${user.email}, Time: ${timeStr}, IP: ${ipAddress || 'N/A'}, Browser: ${browser}, OS: ${os}`
          );
        }
      }

      await user.save();
      throw new ApiError('Invalid email or password', 401);
    }

    // Check account status
    if (user.status === 'Suspended') {
      await auditService.log(
        user._id,
        'Failed Login',
        'Auth',
        null,
        { reason: 'Suspended' },
        ipAddress,
        userAgentStr,
        user._id
      );
      throw new ApiError('Your account has been suspended. Please contact admin.', 403);
    }
    if (user.status === 'Inactive') {
      await auditService.log(
        user._id,
        'Failed Login',
        'Auth',
        null,
        { reason: 'Inactive' },
        ipAddress,
        userAgentStr,
        user._id
      );
      throw new ApiError('Your account is currently inactive.', 403);
    }

    // Successful login: reset failed_attempts and set successful login timestamps
    user.failed_attempts = 0;
    user.last_successful_login = new Date();
    user.lastLogin = new Date();
    await user.save();

    // Log successful login
    await auditService.log(
      user._id,
      'Successful Login',
      'Auth',
      null,
      null,
      ipAddress,
      userAgentStr,
      user._id
    );

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
