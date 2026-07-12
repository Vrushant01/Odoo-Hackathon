import { FLEET_REPORT } from "../mock-data/fleetReport";
import { DRIVER_REPORT } from "../mock-data/driverReport";
import { TRIP_REPORT } from "../mock-data/tripReport";
import { MAINTENANCE_REPORT } from "../mock-data/maintenanceReport";
import { FUEL_REPORT } from "../mock-data/fuelReport";
import { EXPENSE_REPORT } from "../mock-data/expenseReport";
import { PROFITABILITY_REPORT } from "../mock-data/profitabilityReport";
import { ANALYTICS_CHARTS } from "../mock-data/analyticsCharts";
import { ANALYTICS_INSIGHTS } from "../mock-data/analyticsInsights";
import { REPORT_HISTORY, SCHEDULED_REPORTS } from "../mock-data/reportHistory";
import { mockResponse } from "./apiHelper";

let reportHistory = [...REPORT_HISTORY];
let scheduledReports = [...SCHEDULED_REPORTS];

export const reportService = {
  // --- Report Data Endpoints ---

  getFleetReport: async () => {
    return mockResponse(FLEET_REPORT, 400);
  },

  getDriverReport: async () => {
    return mockResponse(DRIVER_REPORT, 400);
  },

  getTripReport: async () => {
    return mockResponse(TRIP_REPORT, 400);
  },

  getMaintenanceReport: async () => {
    return mockResponse(MAINTENANCE_REPORT, 400);
  },

  getFuelReport: async () => {
    return mockResponse(FUEL_REPORT, 400);
  },

  getExpenseReport: async () => {
    return mockResponse(EXPENSE_REPORT, 400);
  },

  getProfitabilityReport: async () => {
    return mockResponse(PROFITABILITY_REPORT, 400);
  },

  getOperationalReport: async () => {
    // Aggregate summary from all modules
    const operational = {
      fleet: FLEET_REPORT.summary,
      drivers: DRIVER_REPORT.summary,
      trips: TRIP_REPORT.summary,
      maintenance: MAINTENANCE_REPORT.summary,
      fuel: FUEL_REPORT.summary,
      expenses: EXPENSE_REPORT.summary,
      profitability: PROFITABILITY_REPORT.summary
    };
    return mockResponse(operational, 500);
  },

  // --- Charts Data ---

  getCharts: async () => {
    return mockResponse(ANALYTICS_CHARTS, 300);
  },

  // --- Insights ---

  getInsights: async () => {
    return mockResponse(ANALYTICS_INSIGHTS, 300);
  },

  // --- Report History ---

  getReportHistory: async () => {
    return mockResponse(reportHistory, 300);
  },

  deleteReport: async (id) => {
    reportHistory = reportHistory.filter((r) => r.id !== id);
    return mockResponse({ success: true }, 200);
  },

  // --- Report Generation ---

  generateReport: async (data) => {
    const newReport = {
      id: `rh-${Date.now()}`,
      title: data.title || `${data.type} Report — ${new Date().toLocaleDateString()}`,
      type: data.type || "Operational",
      generatedBy: data.generatedBy || "System User",
      date: new Date().toISOString().split("T")[0],
      format: data.format || "PDF",
      status: "Ready",
      size: `${(Math.random() * 5 + 1).toFixed(1)} MB`
    };
    reportHistory.unshift(newReport);
    return mockResponse(newReport, 1000);
  },

  // --- Scheduled Reports ---

  getScheduledReports: async () => {
    return mockResponse(scheduledReports, 300);
  },

  toggleScheduledReport: async (id) => {
    scheduledReports = scheduledReports.map((sr) =>
      sr.id === id ? { ...sr, enabled: !sr.enabled } : sr
    );
    const updated = scheduledReports.find((sr) => sr.id === id);
    return mockResponse(updated, 200);
  },

  // --- Export Stubs ---

  exportCSV: async (reportType) => {
    // Stub — backend will generate actual CSV
    return mockResponse({ url: `/api/reports/export/csv/${reportType}`, format: "csv" }, 500);
  },

  exportPDF: async (reportType) => {
    // Stub — backend will generate actual PDF
    return mockResponse({ url: `/api/reports/export/pdf/${reportType}`, format: "pdf" }, 500);
  },

  printReport: async (reportType) => {
    // Stub — backend will handle print rendering
    return mockResponse({ success: true, message: `Print job queued for ${reportType}` }, 300);
  }
};

export default reportService;
