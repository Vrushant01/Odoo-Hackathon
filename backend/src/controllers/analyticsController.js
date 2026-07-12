const analyticsService = require('../services/analyticsService');
const ApiResponse = require('../utils/apiResponse');

const getFleetAnalytics = async (req, res, next) => {
  try {
    const analytics = await analyticsService.getFleetAnalytics();
    return ApiResponse.success(res, 'Fleet analytics fetched successfully.', analytics);
  } catch (error) {
    next(error);
  }
};

const getDriverAnalytics = async (req, res, next) => {
  try {
    const analytics = await analyticsService.getDriverAnalytics();
    return ApiResponse.success(res, 'Driver analytics fetched successfully.', analytics);
  } catch (error) {
    next(error);
  }
};

const getTripAnalytics = async (req, res, next) => {
  try {
    const analytics = await analyticsService.getTripAnalytics();
    return ApiResponse.success(res, 'Trip analytics fetched successfully.', analytics);
  } catch (error) {
    next(error);
  }
};

const getFuelAnalytics = async (req, res, next) => {
  try {
    const analytics = await analyticsService.getFuelAnalytics();
    return ApiResponse.success(res, 'Fuel analytics fetched successfully.', analytics);
  } catch (error) {
    next(error);
  }
};

const getExpenseAnalytics = async (req, res, next) => {
  try {
    const analytics = await analyticsService.getExpenseAnalytics();
    return ApiResponse.success(res, 'Expense analytics fetched successfully.', analytics);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFleetAnalytics,
  getDriverAnalytics,
  getTripAnalytics,
  getFuelAnalytics,
  getExpenseAnalytics
};
