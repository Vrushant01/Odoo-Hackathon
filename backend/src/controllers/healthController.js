const mongoose = require('mongoose');
const ApiResponse = require('../utils/apiResponse');

/**
 * Handle system health checks.
 * Returns connection statuses, api version, server time, and environment configurations.
 */
const getHealthStatus = async (req, res, next) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStatusMap = {
      0: 'Disconnected',
      1: 'Connected',
      2: 'Connecting',
      3: 'Disconnecting'
    };

    const healthReport = {
      status: dbState === 1 ? 'UP' : 'DOWN',
      apiStatus: 'Healthy',
      databaseStatus: dbStatusMap[dbState] || 'Unknown',
      mongodbConnection: dbState === 1 ? 'Connected' : 'Disconnected',
      serverTime: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };

    const isHealthy = dbState === 1;
    const statusCode = isHealthy ? 200 : 503;

    return ApiResponse.success(res, 'System health check completed successfully.', healthReport, statusCode);
  } catch (error) {
    next(error);
  }
};

module.exports = { getHealthStatus };
