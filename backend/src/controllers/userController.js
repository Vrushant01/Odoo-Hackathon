const User = require('../models/User');
const userRepository = require('../repositories/userRepository');
const auditService = require('../services/auditService');
const notificationService = require('../services/notificationService');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const AuditLog = require('../models/AuditLog');

/**
 * Fetch list of all users with search, pagination, filtering, and sorting.
 */
const getUsers = async (req, res, next) => {
  try {
    const results = await userRepository.findAll(req.query);
    return ApiResponse.success(res, 'Users fetched successfully.', results);
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new user.
 */
const createUser = async (req, res, next) => {
  try {
    const { fullName, email, password, role, phoneNumber, department, status } = req.body;

    // Enforce: Only Super Admin can assign the Super Admin role
    if (role === 'Super Admin' && req.user.role !== 'Super Admin') {
      throw new ApiError('Only a Super Admin can assign the Super Admin role.', 403);
    }

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ApiError('Email is already registered.', 400);
    }

    const user = await userRepository.create({
      fullName,
      email,
      password,
      role,
      phoneNumber,
      department,
      status: status || 'Active'
    });

    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgentStr = req.headers['user-agent'] || '';

    // Log audit
    await auditService.log(
      req.user._id,
      'User Created',
      'Users',
      null,
      { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
      ipAddress,
      userAgentStr,
      user._id
    );

    const userObj = user.toObject();
    delete userObj.password;

    return ApiResponse.success(res, 'User created successfully.', userObj);
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing user.
 */
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullName, email, role, phoneNumber, department, status } = req.body;

    const targetUser = await User.findById(id);
    if (!targetUser) {
      throw new ApiError('User not found.', 404);
    }

    // Enforce role assignment security
    if (role && role !== targetUser.role) {
      if ((role === 'Super Admin' || targetUser.role === 'Super Admin') && req.user.role !== 'Super Admin') {
        throw new ApiError('Only a Super Admin can modify or assign the Super Admin role.', 403);
      }
    }

    const oldValues = {
      fullName: targetUser.fullName,
      email: targetUser.email,
      role: targetUser.role,
      phoneNumber: targetUser.phoneNumber,
      department: targetUser.department,
      status: targetUser.status
    };

    if (fullName) targetUser.fullName = fullName;
    if (email) targetUser.email = email;
    if (role) targetUser.role = role;
    if (phoneNumber) targetUser.phoneNumber = phoneNumber;
    if (department) targetUser.department = department;
    if (status) targetUser.status = status;

    const updatedUser = await targetUser.save();

    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgentStr = req.headers['user-agent'] || '';

    // Log audit
    await auditService.log(
      req.user._id,
      role && role !== oldValues.role ? 'Role Changed' : 'UPDATE',
      'Users',
      oldValues,
      { fullName: updatedUser.fullName, email: updatedUser.email, role: updatedUser.role, phoneNumber: updatedUser.phoneNumber, department: updatedUser.department, status: updatedUser.status },
      ipAddress,
      userAgentStr,
      updatedUser._id
    );

    const userObj = updatedUser.toObject();
    delete userObj.password;

    return ApiResponse.success(res, 'User details updated successfully.', userObj);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a user (Super Admin only).
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'Super Admin') {
      throw new ApiError('Only a Super Admin can delete users.', 403);
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      throw new ApiError('User not found.', 404);
    }

    await userRepository.delete(id);

    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgentStr = req.headers['user-agent'] || '';

    // Log audit
    await auditService.log(
      req.user._id,
      'User Deleted',
      'Users',
      { id: targetUser._id, fullName: targetUser.fullName, email: targetUser.email, role: targetUser.role },
      null,
      ipAddress,
      userAgentStr,
      targetUser._id
    );

    return ApiResponse.success(res, 'User deleted successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle active/inactive status.
 */
const toggleStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Active' or 'Inactive'

    if (!['Active', 'Inactive'].includes(status)) {
      throw new ApiError('Invalid status value. Must be Active or Inactive.', 400);
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      throw new ApiError('User not found.', 404);
    }

    // Enforce: only Super Admin can alter status of another Super Admin
    if (targetUser.role === 'Super Admin' && req.user.role !== 'Super Admin') {
      throw new ApiError('Only a Super Admin can modify another Super Admin status.', 403);
    }

    const oldStatus = targetUser.status;
    targetUser.status = status;
    await targetUser.save();

    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgentStr = req.headers['user-agent'] || '';

    // Log audit
    await auditService.log(
      req.user._id,
      'STATUS_CHANGE',
      'Users',
      { status: oldStatus },
      { status: targetUser.status },
      ipAddress,
      userAgentStr,
      targetUser._id
    );

    return ApiResponse.success(res, `User status updated to ${status} successfully.`, targetUser);
  } catch (error) {
    next(error);
  }
};

/**
 * Manually lock an account.
 */
const lockUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const targetUser = await User.findById(id);
    if (!targetUser) {
      throw new ApiError('User not found.', 404);
    }

    if (targetUser.account_locked) {
      throw new ApiError('User account is already locked.', 400);
    }

    targetUser.account_locked = true;
    targetUser.locked_at = new Date();
    targetUser.locked_by = req.user._id;
    targetUser.unlock_reason = null; // Clear previous unlock reason
    await targetUser.save();

    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgentStr = req.headers['user-agent'] || '';

    // Log audit
    await auditService.log(
      req.user._id,
      'Account Locked',
      'Users',
      null,
      { reason: reason || 'Manual Admin Lockout' },
      ipAddress,
      userAgentStr,
      targetUser._id
    );

    // Notify target user
    await notificationService.createNotification(
      targetUser._id,
      'Account Locked',
      'Account Locked',
      `Your account has been manually locked by an Administrator. Reason: ${reason || 'Manual Lockout'}`
    );

    return ApiResponse.success(res, 'User account locked successfully.', targetUser);
  } catch (error) {
    next(error);
  }
};

/**
 * Manually unlock an account (Super Admin only).
 */
const unlockUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (req.user.role !== 'Super Admin') {
      throw new ApiError('Only a Super Admin can unlock accounts.', 403);
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      throw new ApiError('User not found.', 404);
    }

    if (!targetUser.account_locked) {
      throw new ApiError('User account is not locked.', 400);
    }

    targetUser.failed_attempts = 0;
    targetUser.account_locked = false;
    targetUser.locked_at = null;
    targetUser.locked_by = null;
    targetUser.unlock_reason = reason || 'Manual Admin Unlock';
    await targetUser.save();

    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgentStr = req.headers['user-agent'] || '';

    // Log audit
    await auditService.log(
      req.user._id,
      'Account Unlocked',
      'Users',
      null,
      { reason: reason || 'Manual Admin Unlock' },
      ipAddress,
      userAgentStr,
      targetUser._id
    );

    // Notify target user
    await notificationService.createNotification(
      targetUser._id,
      'Account Unlocked',
      'Account Unlocked',
      'Your account has been unlocked by Administrator.'
    );

    return ApiResponse.success(res, 'User account unlocked successfully.', targetUser);
  } catch (error) {
    next(error);
  }
};

/**
 * Reset failed attempts.
 */
const resetAttempts = async (req, res, next) => {
  try {
    const { id } = req.params;

    const targetUser = await User.findById(id);
    if (!targetUser) {
      throw new ApiError('User not found.', 404);
    }

    const oldAttempts = targetUser.failed_attempts;
    targetUser.failed_attempts = 0;
    await targetUser.save();

    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgentStr = req.headers['user-agent'] || '';

    // Log audit
    await auditService.log(
      req.user._id,
      'UPDATE',
      'Users',
      { failed_attempts: oldAttempts },
      { failed_attempts: 0 },
      ipAddress,
      userAgentStr,
      targetUser._id
    );

    return ApiResponse.success(res, 'Failed login attempts reset successfully.', targetUser);
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password (Super Admin only).
 */
const resetPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (req.user.role !== 'Super Admin') {
      throw new ApiError('Only a Super Admin can reset user passwords.', 403);
    }

    if (!newPassword || newPassword.length < 6) {
      throw new ApiError('Password must be at least 6 characters long.', 400);
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      throw new ApiError('User not found.', 404);
    }

    targetUser.password = newPassword;
    await targetUser.save();

    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgentStr = req.headers['user-agent'] || '';

    // Log audit
    await auditService.log(
      req.user._id,
      'Password Reset',
      'Users',
      null,
      null,
      ipAddress,
      userAgentStr,
      targetUser._id
    );

    // Notify user of security update
    await notificationService.createNotification(
      targetUser._id,
      'Account Unlocked',
      'Security Update',
      'Your password has been reset by an Administrator.'
    );

    return ApiResponse.success(res, 'User password reset successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch KPI statistics cards for user management dashboard.
 */
const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'Active' });
    const lockedAccounts = await User.countDocuments({ account_locked: true });
    const inactiveUsers = await User.countDocuments({ status: 'Inactive' });

    // Today's login audits
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todaysLogins = await User.countDocuments({
      last_successful_login: { $gte: startOfToday, $lte: endOfToday }
    });

    const todaysFailedAttempts = await AuditLog.countDocuments({
      action: 'Failed Login',
      timestamp: { $gte: startOfToday, $lte: endOfToday }
    });

    return ApiResponse.success(res, 'User statistics loaded successfully.', {
      totalUsers,
      activeUsers,
      lockedAccounts,
      inactiveUsers,
      todaysLogins,
      todaysFailedAttempts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch Audit log entries specifically filtered for user operations.
 */
const getAuditLogsList = async (req, res, next) => {
  try {
    const query = {
      ...req.query,
      module: 'Users'
    };
    if (req.query.includeAuth === 'true') {
      delete query.module;
      query.$or = [{ module: 'Users' }, { module: 'Auth' }];
      delete query.includeAuth;
    }

    const logs = await auditService.getAuditLogs(query);
    return ApiResponse.success(res, 'Audit logs fetched successfully.', logs);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleStatus,
  lockUser,
  unlockUser,
  resetAttempts,
  resetPassword,
  getStats,
  getAuditLogsList
};
