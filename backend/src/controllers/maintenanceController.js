const maintenanceService = require('../services/maintenanceService');
const Maintenance = require('../models/Maintenance');
const auditService = require('../services/auditService');
const ApiResponse = require('../utils/apiResponse');

const mapUploadedFiles = (req) => {
  if (req.files && req.files.attachments) {
    req.body.attachments = req.files.attachments.map(file => `/uploads/maintenance/${file.filename}`);
  }
};

const createMaintenance = async (req, res, next) => {
  try {
    mapUploadedFiles(req);
    const maintenance = await maintenanceService.createMaintenance(req.body, req.user.id);
    await auditService.log(
      req.user.id,
      'CREATE',
      'Maintenance',
      null,
      maintenance.toObject ? maintenance.toObject() : maintenance,
      req.ip,
      req.headers['user-agent']
    );
    return ApiResponse.success(res, 'Maintenance scheduled successfully.', maintenance, 201);
  } catch (error) {
    next(error);
  }
};

const getMaintenanceList = async (req, res, next) => {
  try {
    const data = await maintenanceService.getMaintenanceList(req.query);
    return ApiResponse.success(res, 'Maintenance logs fetched successfully.', data);
  } catch (error) {
    next(error);
  }
};

const getMaintenanceDetails = async (req, res, next) => {
  try {
    const data = await maintenanceService.getMaintenanceDetails(req.params.id);
    return ApiResponse.success(res, 'Maintenance details fetched successfully.', data);
  } catch (error) {
    next(error);
  }
};

const updateMaintenance = async (req, res, next) => {
  try {
    mapUploadedFiles(req);
    const original = await Maintenance.findById(req.params.id);
    const maintenance = await maintenanceService.updateMaintenance(req.params.id, req.body, req.user.id);
    await auditService.log(
      req.user.id,
      'UPDATE',
      'Maintenance',
      original ? original.toObject() : null,
      maintenance.toObject ? maintenance.toObject() : maintenance,
      req.ip,
      req.headers['user-agent']
    );
    return ApiResponse.success(res, 'Maintenance updated successfully.', maintenance);
  } catch (error) {
    next(error);
  }
};

const deleteMaintenance = async (req, res, next) => {
  try {
    const original = await Maintenance.findById(req.params.id);
    await maintenanceService.deleteMaintenance(req.params.id, req.user.id);
    await auditService.log(
      req.user.id,
      'DELETE',
      'Maintenance',
      original ? original.toObject() : null,
      null,
      req.ip,
      req.headers['user-agent']
    );
    return ApiResponse.success(res, 'Maintenance log deleted successfully.');
  } catch (error) {
    next(error);
  }
};

const startMaintenance = async (req, res, next) => {
  try {
    const original = await Maintenance.findById(req.params.id);
    const maintenance = await maintenanceService.startMaintenance(req.params.id, req.user.id);
    await auditService.log(
      req.user.id,
      'STATUS_CHANGE',
      'Maintenance',
      original ? original.toObject() : null,
      maintenance.toObject ? maintenance.toObject() : maintenance,
      req.ip,
      req.headers['user-agent']
    );
    return ApiResponse.success(res, 'Maintenance started successfully.', maintenance);
  } catch (error) {
    next(error);
  }
};

const completeMaintenance = async (req, res, next) => {
  try {
    const original = await Maintenance.findById(req.params.id);
    const maintenance = await maintenanceService.completeMaintenance(req.params.id, req.body, req.user.id);
    await auditService.log(
      req.user.id,
      'STATUS_CHANGE',
      'Maintenance',
      original ? original.toObject() : null,
      maintenance.toObject ? maintenance.toObject() : maintenance,
      req.ip,
      req.headers['user-agent']
    );
    return ApiResponse.success(res, 'Maintenance completed successfully.', maintenance);
  } catch (error) {
    next(error);
  }
};

const cancelMaintenance = async (req, res, next) => {
  try {
    const original = await Maintenance.findById(req.params.id);
    const maintenance = await maintenanceService.cancelMaintenance(req.params.id, req.user.id);
    await auditService.log(
      req.user.id,
      'STATUS_CHANGE',
      'Maintenance',
      original ? original.toObject() : null,
      maintenance.toObject ? maintenance.toObject() : maintenance,
      req.ip,
      req.headers['user-agent']
    );
    return ApiResponse.success(res, 'Maintenance cancelled successfully.', maintenance);
  } catch (error) {
    next(error);
  }
};

const getStatistics = async (req, res, next) => {
  try {
    const stats = await maintenanceService.getStatistics();
    return ApiResponse.success(res, 'Maintenance statistics fetched successfully.', stats);
  } catch (error) {
    next(error);
  }
};

const getUpcoming = async (req, res, next) => {
  try {
    const data = await maintenanceService.getUpcoming();
    return ApiResponse.success(res, 'Upcoming maintenance logs fetched successfully.', data);
  } catch (error) {
    next(error);
  }
};

const getOverdue = async (req, res, next) => {
  try {
    const data = await maintenanceService.getOverdue();
    return ApiResponse.success(res, 'Overdue maintenance logs fetched successfully.', data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMaintenance,
  getMaintenanceList,
  getMaintenanceDetails,
  updateMaintenance,
  deleteMaintenance,
  startMaintenance,
  completeMaintenance,
  cancelMaintenance,
  getStatistics,
  getUpcoming,
  getOverdue
};
