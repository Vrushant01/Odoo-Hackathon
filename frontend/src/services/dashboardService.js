import { MOCK_DASHBOARD_SUMMARY } from "../mock-data/dashboardSummary";
import { MOCK_DASHBOARD_CHARTS } from "../mock-data/dashboardCharts";
import { MOCK_RECENT_TRIPS } from "../mock-data/recentTrips";
import { MOCK_MAINTENANCE_SUMMARY } from "../mock-data/maintenanceSummary";
import { MOCK_FUEL_SUMMARY } from "../mock-data/fuelSummary";
import { MOCK_EXPENSE_SUMMARY } from "../mock-data/expenseSummary";
import { MOCK_NOTIFICATIONS } from "../mock-data/notifications";
import { mockResponse } from "./apiHelper";

export const dashboardService = {
  getDashboardSummary: async () => {
    return mockResponse(MOCK_DASHBOARD_SUMMARY, 300);
  },

  getDashboardCharts: async () => {
    return mockResponse(MOCK_DASHBOARD_CHARTS, 400);
  },

  getRecentTrips: async () => {
    return mockResponse(MOCK_RECENT_TRIPS, 300);
  },

  getMaintenanceSummary: async () => {
    return mockResponse(MOCK_MAINTENANCE_SUMMARY, 300);
  },

  getFuelSummary: async () => {
    return mockResponse(MOCK_FUEL_SUMMARY, 200);
  },

  getExpenseSummary: async () => {
    return mockResponse(MOCK_EXPENSE_SUMMARY, 200);
  },

  getNotifications: async () => {
    return mockResponse(MOCK_NOTIFICATIONS, 200);
  }
};

export default dashboardService;
