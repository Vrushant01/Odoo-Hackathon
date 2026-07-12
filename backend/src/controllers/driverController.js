const driverService = require('../services/driverService');
const Driver = require('../models/Driver');
const auditService = require('../services/auditService');
const ApiResponse = require('../utils/apiResponse');

/**
 * Map Multer uploaded files to request body parameters.
 */
const mapUploadedFiles = (req) => {
  if (req.files) {
    if (req.files.profileImage) {
      req.body.profileImage = `/uploads/drivers/${req.files.profileImage[0].filename}`;
    }
    if (req.files.licenseDocument) {
      req.body.licenseDocument = `/uploads/drivers/${req.files.licenseDocument[0].filename}`;
    }
    if (req.files.governmentId) {
      req.body.governmentId = `/uploads/drivers/${req.files.governmentId[0].filename}`;
    }
    if (req.files.medicalCertificate) {
      req.body.medicalCertificate = `/uploads/drivers/${req.files.medicalCertificate[0].filename}`;
    }
    if (req.files.policeVerification) {
      req.body.policeVerification = `/uploads/drivers/${req.files.policeVerification[0].filename}`;
    }
  }
};

/**
 * Register a new driver.
 */
const registerDriver = async (req, res, next) => {
  try {
    mapUploadedFiles(req);
    const driver = await driverService.registerDriver(req.body, req.user.id);
    await auditService.log(
      req.user.id,
      'CREATE',
      'Drivers',
      null,
      driver.toObject ? driver.toObject() : driver,
      req.ip,
      req.headers['user-agent']
    );
    return ApiResponse.success(res, 'Driver registered successfully.', driver, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all drivers (paginated, sorted, filtered).
 */
const getDrivers = async (req, res, next) => {
  try {
    const data = await driverService.getDrivers(req.query);
    return ApiResponse.success(res, 'Drivers fetched successfully.', data);
  } catch (error) {
    next(error);
  }
};

/**
 * Get detailed profile information for a driver.
 */
const getDriverDetails = async (req, res, next) => {
  try {
    const data = await driverService.getDriverDetails(req.params.id);
    return ApiResponse.success(res, 'Driver details fetched successfully.', data);
  } catch (error) {
    next(error);
  }
};

/**
 * Update driver details.
 */
const updateDriver = async (req, res, next) => {
  try {
    mapUploadedFiles(req);
    const original = await Driver.findById(req.params.id);
    const driver = await driverService.updateDriver(req.params.id, req.body, req.user.id);
    await auditService.log(
      req.user.id,
      'UPDATE',
      'Drivers',
      original ? original.toObject() : null,
      driver.toObject ? driver.toObject() : driver,
      req.ip,
      req.headers['user-agent']
    );
    return ApiResponse.success(res, 'Driver updated successfully.', driver);
  } catch (error) {
    next(error);
  }
};

/**
 * Soft delete a driver.
 */
const deleteDriver = async (req, res, next) => {
  try {
    const original = await Driver.findById(req.params.id);
    await driverService.deleteDriver(req.params.id, req.user.id);
    await auditService.log(
      req.user.id,
      'DELETE',
      'Drivers',
      original ? original.toObject() : null,
      null,
      req.ip,
      req.headers['user-agent']
    );
    return ApiResponse.success(res, 'Driver deleted successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * Suspend a driver.
 */
const suspendDriver = async (req, res, next) => {
  try {
    const original = await Driver.findById(req.params.id);
    const driver = await driverService.suspendDriver(req.params.id, req.body, req.user.id);
    await auditService.log(
      req.user.id,
      'STATUS_CHANGE',
      'Drivers',
      original ? original.toObject() : null,
      driver.toObject ? driver.toObject() : driver,
      req.ip,
      req.headers['user-agent']
    );
    return ApiResponse.success(res, 'Driver suspended successfully.', driver);
  } catch (error) {
    next(error);
  }
};

/**
 * Activate a suspended driver.
 */
const activateDriver = async (req, res, next) => {
  try {
    const original = await Driver.findById(req.params.id);
    const driver = await driverService.activateDriver(req.params.id, req.user.id);
    await auditService.log(
      req.user.id,
      'STATUS_CHANGE',
      'Drivers',
      original ? original.toObject() : null,
      driver.toObject ? driver.toObject() : driver,
      req.ip,
      req.headers['user-agent']
    );
    return ApiResponse.success(res, 'Driver activated successfully.', driver);
  } catch (error) {
    next(error);
  }
};

/**
 * Get history logs for a specific driver.
 */
const getDriverHistory = async (req, res, next) => {
  try {
    const history = await driverService.getDriverHistory(req.params.id);
    return ApiResponse.success(res, 'Driver history fetched successfully.', history);
  } catch (error) {
    next(error);
  }
};

/**
 * Get performance metrics report for a driver.
 */
const getDriverPerformance = async (req, res, next) => {
  try {
    const performance = await driverService.getPerformance(req.params.id);
    return ApiResponse.success(res, 'Driver performance report fetched successfully.', performance);
  } catch (error) {
    next(error);
  }
};

/**
 * Get overall driver statistics.
 */
const getDriverStatistics = async (req, res, next) => {
  try {
    const stats = await driverService.getDriverStatistics();
    return ApiResponse.success(res, 'Driver statistics fetched successfully.', stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerDriver,
  getDrivers,
  getDriverDetails,
  updateDriver,
  deleteDriver,
  suspendDriver,
  activateDriver,
  getDriverHistory,
  getDriverPerformance,
  getDriverStatistics
};
