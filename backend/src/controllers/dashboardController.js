const dashboardService = require('../services/dashboardService');
const ApiResponse = require('../utils/apiResponse');

const getDashboardSummary = async (req, res, next) => {
  try {
    const summary = await dashboardService.getSummary();
    return ApiResponse.success(res, 'Dashboard summary fetched successfully.', summary);
  } catch (error) {
    next(error);
  }
};

const getDashboardCharts = async (req, res, next) => {
  try {
    const charts = await dashboardService.getCharts();
    return ApiResponse.success(res, 'Dashboard charts data fetched successfully.', charts);
  } catch (error) {
    next(error);
  }
};

const getRecentActivities = async (req, res, next) => {
  try {
    const activities = await dashboardService.getRecentActivities();
    return ApiResponse.success(res, 'Recent activities fetched successfully.', activities);
  } catch (error) {
    next(error);
  }
};

const getDashboardMaintenance = async (req, res, next) => {
  try {
    const maintenance = await dashboardService.getMaintenanceLogs();
    return ApiResponse.success(res, 'Dashboard maintenance logs fetched successfully.', maintenance);
  } catch (error) {
    next(error);
  }
};

const getDashboardNotifications = async (req, res, next) => {
  try {
    const notifications = await dashboardService.getNotifications(req.user.id);
    return ApiResponse.success(res, 'Dashboard notifications fetched successfully.', notifications);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardSummary,
  getDashboardCharts,
  getRecentActivities,
  getDashboardMaintenance,
  getDashboardNotifications
};
