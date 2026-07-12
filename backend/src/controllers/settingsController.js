const settingsService = require('../services/settingsService');
const auditService = require('../services/auditService');
const ApiResponse = require('../utils/apiResponse');

const getSettings = async (req, res, next) => {
  try {
    const settings = await settingsService.getSettings();
    return ApiResponse.success(res, 'Settings fetched successfully.', settings);
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const originalSettings = await settingsService.getSettings();
    const updated = await settingsService.updateSettings(req.body);
    
    // Log audit trail
    await auditService.log(
      req.user.id,
      'UPDATE',
      'Settings',
      originalSettings.toObject(),
      updated.toObject(),
      req.ip,
      req.headers['user-agent']
    );

    return ApiResponse.success(res, 'Settings updated successfully.', updated);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings
};
