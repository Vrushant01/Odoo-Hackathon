import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import reportService from "../services/reportService";
import { useGlobalFilters } from "../contexts/FilterContext";

const INITIAL_FILTERS = {
  dateRange: { start: "", end: "" },
  vehicle: "",
  vehicleType: "",
  driver: "",
  tripStatus: "",
  maintenanceStatus: "",
  region: "",
  fuelType: "",
  expenseType: ""
};

export const useReports = () => {
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Global filters from context
  const { globalFilters } = useGlobalFilters();

  // Report data sections
  const [fleetReport, setFleetReport] = useState(null);
  const [driverReport, setDriverReport] = useState(null);
  const [tripReport, setTripReport] = useState(null);
  const [maintenanceReport, setMaintenanceReport] = useState(null);
  const [fuelReport, setFuelReport] = useState(null);
  const [expenseReport, setExpenseReport] = useState(null);
  const [profitabilityReport, setProfitabilityReport] = useState(null);
  const [chartsData, setChartsData] = useState(null);
  const [insights, setInsights] = useState([]);
  const [reportHistory, setReportHistory] = useState([]);
  const [scheduledReports, setScheduledReports] = useState([]);

  // Filters
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // Report generation
  const [isGenerating, setIsGenerating] = useState(false);

  // --- Data Loading ---

  const loadAllReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    // Build filter params to pass to each report service call
    const filterParams = {
      vehicleType: globalFilters.vehicleType,
      status: globalFilters.vehicleStatus,
      region: globalFilters.region,
      driver: globalFilters.driver,
      startDate: globalFilters.startDate,
      endDate: globalFilters.endDate,
      tripStatus: globalFilters.tripStatus
    };
    try {
      const [
        fleet,
        driver,
        trip,
        maintenance,
        fuel,
        expense,
        profitability,
        charts,
        insightData,
        history,
        scheduled
      ] = await Promise.all([
        reportService.getFleetReport(filterParams),
        reportService.getDriverReport(filterParams),
        reportService.getTripReport(filterParams),
        reportService.getMaintenanceReport(filterParams),
        reportService.getFuelReport(filterParams),
        reportService.getExpenseReport(filterParams),
        reportService.getProfitabilityReport(filterParams),
        reportService.getCharts(filterParams),
        reportService.getInsights(filterParams),
        reportService.getReportHistory(),
        reportService.getScheduledReports()
      ]);

      setFleetReport(fleet);
      setDriverReport(driver);
      setTripReport(trip);
      setMaintenanceReport(maintenance);
      setFuelReport(fuel);
      setExpenseReport(expense);
      setProfitabilityReport(profitability);
      setChartsData(charts);
      setInsights(insightData);
      setReportHistory(history);
      setScheduledReports(scheduled);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || "Failed to load reports");
      toast.error("Failed to load reports data");
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    globalFilters.vehicleType,
    globalFilters.vehicleStatus,
    globalFilters.region,
    globalFilters.driver,
    globalFilters.startDate,
    globalFilters.endDate,
    globalFilters.tripStatus
  ]);

  useEffect(() => {
    loadAllReports();
  }, [loadAllReports]);

  // --- Filters ---

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => {
      if (key === "dateRange") {
        return { ...prev, dateRange: value };
      }
      return { ...prev, [key]: value };
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([key, val]) => {
      if (key === "dateRange") return val.start || val.end;
      return val !== "";
    });
  }, [filters]);

  // --- Summary Cards (Memoized) ---

  const summaryCards = useMemo(() => {
    if (!fleetReport || !driverReport || !tripReport || !fuelReport || !expenseReport || !profitabilityReport) {
      return null;
    }
    return {
      totalVehicles: fleetReport.summary.totalVehicles,
      totalDrivers: driverReport.summary.totalDrivers,
      totalTrips: tripReport.summary.totalTrips,
      completedTrips: tripReport.summary.completedTrips,
      fleetUtilization: `${fleetReport.summary.fleetUtilization}%`,
      totalFuelUsed: `${fuelReport.summary.totalFuelUsed.toLocaleString()} L`,
      totalOperationalCost: `$${expenseReport.summary.totalExpenses.toLocaleString()}`,
      avgFuelEfficiency: `${fuelReport.summary.avgEfficiency} km/L`,
      totalRevenue: `$${profitabilityReport.summary.totalRevenue.toLocaleString()}`,
      netProfit: `$${profitabilityReport.summary.netProfit.toLocaleString()}`,
      avgTripDistance: `${tripReport.summary.avgDistance} km`,
      avgMaintenanceCost: `$${maintenanceReport.summary.avgCostPerRecord}`
    };
  }, [fleetReport, driverReport, tripReport, maintenanceReport, fuelReport, expenseReport, profitabilityReport]);

  // --- Report Generation ---

  const generateReport = useCallback(async (reportConfig) => {
    setIsGenerating(true);
    try {
      const newReport = await reportService.generateReport(reportConfig);
      setReportHistory((prev) => [newReport, ...prev]);
      toast.success(`${reportConfig.type} report generated successfully`);
      return newReport;
    } catch (err) {
      toast.error("Failed to generate report");
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // --- Report History Actions ---

  const deleteHistoryReport = useCallback(async (id) => {
    try {
      await reportService.deleteReport(id);
      setReportHistory((prev) => prev.filter((r) => r.id !== id));
      toast.success("Report deleted");
    } catch (err) {
      toast.error("Failed to delete report");
    }
  }, []);

  // --- Scheduled Reports ---

  const toggleSchedule = useCallback(async (id) => {
    try {
      const updated = await reportService.toggleScheduledReport(id);
      setScheduledReports((prev) =>
        prev.map((sr) => (sr.id === id ? updated : sr))
      );
      toast.success(`Schedule ${updated.enabled ? "enabled" : "disabled"}`);
    } catch (err) {
      toast.error("Failed to update schedule");
    }
  }, []);

  // --- Export ---

  const exportReport = useCallback(async (format, reportType = "operational") => {
    try {
      if (format === "csv") {
        await reportService.exportCSV(reportType);
      } else if (format === "pdf") {
        await reportService.exportPDF(reportType);
      } else if (format === "print") {
        await reportService.printReport(reportType);
      }
      toast.success(`${format.toUpperCase()} export initiated for ${reportType}`);
    } catch (err) {
      toast.error(`Failed to export ${format}`);
    }
  }, []);

  // --- Refresh ---

  const refresh = useCallback(() => {
    loadAllReports();
    toast.info("Reports data refreshed");
  }, [loadAllReports]);

  return {
    // State
    isLoading,
    error,
    lastUpdated,

    // Report Data
    fleetReport,
    driverReport,
    tripReport,
    maintenanceReport,
    fuelReport,
    expenseReport,
    profitabilityReport,
    chartsData,
    insights,
    reportHistory,
    scheduledReports,

    // Computed
    summaryCards,

    // Filters
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters,

    // Actions
    generateReport,
    isGenerating,
    deleteHistoryReport,
    toggleSchedule,
    exportReport,
    refresh
  };
};

export default useReports;
