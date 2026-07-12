const dashboardService = require('./dashboardService');
const reportService = require('./reportService');

class AnalyticsService {
  /**
   * General fleet operational KPIs and ROIs.
   */
  async getFleetAnalytics() {
    const summary = await dashboardService.getSummary();
    const fleetReport = await reportService.getFleetReport();
    
    // Net Margin = (Profit / Revenue) * 100
    const netMargin = summary.revenue > 0 
      ? parseFloat(((summary.profit / summary.revenue) * 100).toFixed(2))
      : 0;

    return {
      fleetUtilization: summary.fleetUtilization,
      vehicleROI: fleetReport.vehicleROI,
      averageFuelEfficiency: summary.averageFuelEfficiency,
      averageTripDistance: fleetReport.averageDistance,
      averageMaintenanceCost: fleetReport.averageCost,
      averageOperationalCost: summary.totalOperationalCost,
      revenue: summary.revenue,
      profit: summary.profit,
      netMargin
    };
  }

  /**
   * Driver performance score rankings.
   */
  async getDriverAnalytics() {
    return await reportService.getDriverReport();
  }

  /**
   * Trip completion rate patterns.
   */
  async getTripAnalytics() {
    return await reportService.getTripReport();
  }

  /**
   * Fuel consumption efficiency metrics.
   */
  async getFuelAnalytics() {
    return await reportService.getFuelReport();
  }

  /**
   * Operational costs trend reviews.
   */
  async getExpenseAnalytics() {
    return await reportService.getExpenseReport();
  }
}

module.exports = new AnalyticsService();
