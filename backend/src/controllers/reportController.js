const reportService = require('../services/reportService');
const ApiResponse = require('../utils/apiResponse');

const getFleetReport = async (req, res, next) => {
  try {
    const report = await reportService.getFleetReport();
    return ApiResponse.success(res, 'Fleet report fetched successfully.', report);
  } catch (error) {
    next(error);
  }
};

const getDriverReport = async (req, res, next) => {
  try {
    const report = await reportService.getDriverReport();
    return ApiResponse.success(res, 'Driver report fetched successfully.', report);
  } catch (error) {
    next(error);
  }
};

const getTripReport = async (req, res, next) => {
  try {
    const report = await reportService.getTripReport();
    return ApiResponse.success(res, 'Trip report fetched successfully.', report);
  } catch (error) {
    next(error);
  }
};

const getMaintenanceReport = async (req, res, next) => {
  try {
    const report = await reportService.getMaintenanceReport();
    return ApiResponse.success(res, 'Maintenance report fetched successfully.', report);
  } catch (error) {
    next(error);
  }
};

const getFuelReport = async (req, res, next) => {
  try {
    const report = await reportService.getFuelReport();
    return ApiResponse.success(res, 'Fuel report fetched successfully.', report);
  } catch (error) {
    next(error);
  }
};

const getExpenseReport = async (req, res, next) => {
  try {
    const report = await reportService.getExpenseReport();
    return ApiResponse.success(res, 'Expense report fetched successfully.', report);
  } catch (error) {
    next(error);
  }
};

const getProfitabilityReport = async (req, res, next) => {
  try {
    const report = await reportService.getProfitabilityReport();
    return ApiResponse.success(res, 'Profitability report fetched successfully.', report);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFleetReport,
  getDriverReport,
  getTripReport,
  getMaintenanceReport,
  getFuelReport,
  getExpenseReport,
  getProfitabilityReport
};
