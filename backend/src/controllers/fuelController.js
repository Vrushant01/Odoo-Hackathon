const fuelService = require('../services/fuelService');
const FuelLog = require('../models/FuelLog');
const auditService = require('../services/auditService');
const ApiResponse = require('../utils/apiResponse');

const createFuelLog = async (req, res, next) => {
  try {
    const log = await fuelService.createFuelLog(req.body, req.user.id);
    await auditService.log(
      req.user.id,
      'CREATE',
      'FuelLogs',
      null,
      log.toObject ? log.toObject() : log,
      req.ip,
      req.headers['user-agent']
    );
    return ApiResponse.success(res, 'Fuel log created successfully.', log, 201);
  } catch (error) {
    next(error);
  }
};

const getFuelLogs = async (req, res, next) => {
  try {
    const data = await fuelService.getFuelLogs(req.query);
    return ApiResponse.success(res, 'Fuel logs fetched successfully.', data);
  } catch (error) {
    next(error);
  }
};

const getFuelDetails = async (req, res, next) => {
  try {
    const log = await fuelService.getFuelDetails(req.params.id);
    return ApiResponse.success(res, 'Fuel log details fetched successfully.', log);
  } catch (error) {
    next(error);
  }
};

const updateFuelLog = async (req, res, next) => {
  try {
    const original = await FuelLog.findById(req.params.id);
    const log = await fuelService.updateFuelLog(req.params.id, req.body, req.user.id);
    await auditService.log(
      req.user.id,
      'UPDATE',
      'FuelLogs',
      original ? original.toObject() : null,
      log.toObject ? log.toObject() : log,
      req.ip,
      req.headers['user-agent']
    );
    return ApiResponse.success(res, 'Fuel log updated successfully.', log);
  } catch (error) {
    next(error);
  }
};

const deleteFuelLog = async (req, res, next) => {
  try {
    const original = await FuelLog.findById(req.params.id);
    await fuelService.deleteFuelLog(req.params.id, req.user.id);
    await auditService.log(
      req.user.id,
      'DELETE',
      'FuelLogs',
      original ? original.toObject() : null,
      null,
      req.ip,
      req.headers['user-agent']
    );
    return ApiResponse.success(res, 'Fuel log deleted successfully.');
  } catch (error) {
    next(error);
  }
};

const getFuelStatistics = async (req, res, next) => {
  try {
    const stats = await fuelService.getFuelStatistics();
    return ApiResponse.success(res, 'Fuel statistics fetched successfully.', stats);
  } catch (error) {
    next(error);
  }
};

const getFuelLogsByVehicle = async (req, res, next) => {
  try {
    const data = await fuelService.getFuelLogsByVehicle(req.params.vehicleId);
    return ApiResponse.success(res, 'Fuel logs for vehicle fetched successfully.', data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFuelLog,
  getFuelLogs,
  getFuelDetails,
  updateFuelLog,
  deleteFuelLog,
  getFuelStatistics,
  getFuelLogsByVehicle
};
