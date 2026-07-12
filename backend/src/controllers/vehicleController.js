const vehicleService = require('../services/vehicleService');
const Vehicle = require('../models/Vehicle');
const auditService = require('../services/auditService');
const ApiResponse = require('../utils/apiResponse');

/**
 * Maps uploaded files from req.files to req.body.
 */
const mapUploadedFiles = (req) => {
  if (req.files) {
    if (req.files.registrationCertificate) {
      req.body.registrationCertificate = `/uploads/vehicles/${req.files.registrationCertificate[0].filename}`;
    }
    if (req.files.fitnessCertificate) {
      req.body.fitnessCertificate = `/uploads/vehicles/${req.files.fitnessCertificate[0].filename}`;
    }
    if (req.files.pollutionCertificate) {
      req.body.pollutionCertificate = `/uploads/vehicles/${req.files.pollutionCertificate[0].filename}`;
    }
  }
};

/**
 * Register a new vehicle.
 */
const registerVehicle = async (req, res, next) => {
  try {
    mapUploadedFiles(req);
    const vehicle = await vehicleService.registerVehicle(req.body, req.user.id);
    await auditService.log(
      req.user.id,
      'CREATE',
      'Vehicles',
      null,
      vehicle.toObject ? vehicle.toObject() : vehicle,
      req.ip,
      req.headers['user-agent']
    );
    return ApiResponse.success(res, 'Vehicle registered successfully.', vehicle, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all vehicles (paginated, sorted, filtered).
 */
const getVehicles = async (req, res, next) => {
  try {
    const data = await vehicleService.getVehicles(req.query);
    return ApiResponse.success(res, 'Vehicles fetched successfully.', data);
  } catch (error) {
    next(error);
  }
};

/**
 * Get detailed information for a single vehicle.
 */
const getVehicleDetails = async (req, res, next) => {
  try {
    const data = await vehicleService.getVehicleDetails(req.params.id);
    return ApiResponse.success(res, 'Vehicle details fetched successfully.', data);
  } catch (error) {
    next(error);
  }
};

/**
 * Update vehicle details.
 */
const updateVehicle = async (req, res, next) => {
  try {
    mapUploadedFiles(req);
    const original = await Vehicle.findById(req.params.id);
    const vehicle = await vehicleService.updateVehicle(req.params.id, req.body, req.user.id);
    await auditService.log(
      req.user.id,
      'UPDATE',
      'Vehicles',
      original ? original.toObject() : null,
      vehicle.toObject ? vehicle.toObject() : vehicle,
      req.ip,
      req.headers['user-agent']
    );
    return ApiResponse.success(res, 'Vehicle updated successfully.', vehicle);
  } catch (error) {
    next(error);
  }
};

/**
 * Soft delete a vehicle.
 */
const deleteVehicle = async (req, res, next) => {
  try {
    const original = await Vehicle.findById(req.params.id);
    await vehicleService.deleteVehicle(req.params.id, req.user.id);
    await auditService.log(
      req.user.id,
      'DELETE',
      'Vehicles',
      original ? original.toObject() : null,
      null,
      req.ip,
      req.headers['user-agent']
    );
    return ApiResponse.success(res, 'Vehicle deleted successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * Retire a vehicle.
 */
const retireVehicle = async (req, res, next) => {
  try {
    const original = await Vehicle.findById(req.params.id);
    const vehicle = await vehicleService.retireVehicle(req.params.id, req.user.id);
    await auditService.log(
      req.user.id,
      'STATUS_CHANGE',
      'Vehicles',
      original ? original.toObject() : null,
      vehicle.toObject ? vehicle.toObject() : vehicle,
      req.ip,
      req.headers['user-agent']
    );
    return ApiResponse.success(res, 'Vehicle retired successfully.', vehicle);
  } catch (error) {
    next(error);
  }
};

/**
 * Get history logs for a specific vehicle.
 */
const getVehicleHistory = async (req, res, next) => {
  try {
    const history = await vehicleService.getVehicleHistory(req.params.id);
    return ApiResponse.success(res, 'Vehicle history fetched successfully.', history);
  } catch (error) {
    next(error);
  }
};

/**
 * Get overall vehicle statistics.
 */
const getVehicleStatistics = async (req, res, next) => {
  try {
    const stats = await vehicleService.getVehicleStatistics();
    return ApiResponse.success(res, 'Vehicle statistics fetched successfully.', stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerVehicle,
  getVehicles,
  getVehicleDetails,
  updateVehicle,
  deleteVehicle,
  retireVehicle,
  getVehicleHistory,
  getVehicleStatistics
};
