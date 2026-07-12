import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import dashboardService from "../services/dashboardService";

export const useDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Raw dashboard datasets
  const [summary, setSummary] = useState(null);
  const [charts, setCharts] = useState(null);
  const [trips, setTrips] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [fuel, setFuel] = useState(null);
  const [expenses, setExpenses] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Filter States
  const [filters, setFilters] = useState({
    vehicleType: "",
    vehicleStatus: "",
    region: "",
    driver: "",
    startDate: "",
    endDate: "",
    tripStatus: ""
  });

  const [searchTerm, setSearchTerm] = useState("");

  const fetchDashboardData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setError(null);

    try {
      const [
        summaryRes,
        chartsRes,
        tripsRes,
        maintenanceRes,
        fuelRes,
        expensesRes,
        notifRes
      ] = await Promise.all([
        dashboardService.getDashboardSummary(),
        dashboardService.getDashboardCharts(),
        dashboardService.getRecentTrips(),
        dashboardService.getMaintenanceSummary(),
        dashboardService.getFuelSummary(),
        dashboardService.getExpenseSummary(),
        dashboardService.getNotifications()
      ]);

      setSummary(summaryRes);
      setCharts(chartsRes);
      setTrips(tripsRes);
      setMaintenance(maintenanceRes);
      setFuel(fuelRes);
      setExpenses(expensesRes);
      setNotifications(notifRes);

      if (isSilent) {
        toast.success("Dashboard refreshed successfully!");
      }
    } catch (err) {
      console.error("Dashboard load failure:", err);
      setError("Failed to fetch dashboard data. Please try again.");
      toast.error("Failed to load dashboard metrics");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      vehicleType: "",
      vehicleStatus: "",
      region: "",
      driver: "",
      startDate: "",
      endDate: "",
      tripStatus: ""
    });
    setSearchTerm("");
    toast.success("Filters reset successfully!");
  }, []);

  const refresh = useCallback(() => {
    fetchDashboardData(true);
  }, [fetchDashboardData]);

  // Client-Side Filtered Recent Trips
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      // 1. Filter by Vehicle Type
      if (filters.vehicleType && trip.vehicleType !== filters.vehicleType) {
        return false;
      }
      // 2. Filter by Vehicle Status
      if (filters.vehicleStatus && trip.vehicleStatus !== filters.vehicleStatus) {
        return false;
      }
      // 3. Filter by Region
      if (filters.region && trip.region !== filters.region) {
        return false;
      }
      // 4. Filter by Driver
      if (filters.driver && !trip.driver.toLowerCase().includes(filters.driver.toLowerCase())) {
        return false;
      }
      // 5. Filter by Trip Status
      if (filters.tripStatus && trip.status !== filters.tripStatus) {
        return false;
      }
      // 6. Filter by Date range
      if (filters.startDate && trip.startDate < filters.startDate) {
        return false;
      }
      if (filters.endDate && trip.startDate > filters.endDate) {
        return false;
      }
      // 7. Global Search check (searches Trip ID, Driver, Source, Destination, Vehicle)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          trip.id.toLowerCase().includes(searchLower) ||
          trip.driver.toLowerCase().includes(searchLower) ||
          trip.vehicle.toLowerCase().includes(searchLower) ||
          trip.source.toLowerCase().includes(searchLower) ||
          trip.destination.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [trips, filters, searchTerm]);

  // Client-Side Filtered Maintenance Logs
  const filteredMaintenance = useMemo(() => {
    return maintenance.filter((item) => {
      if (filters.vehicleStatus && item.status !== filters.vehicleStatus) {
        // Map in-progress/scheduled
        if (filters.vehicleStatus === "Maintenance" && item.status !== "In Progress") {
          return false;
        }
      }
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          item.vehicle.toLowerCase().includes(searchLower) ||
          item.type.toLowerCase().includes(searchLower) ||
          item.mechanic.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [maintenance, filters.vehicleStatus, searchTerm]);

  // Compute live KPIs dynamically based on filtered subset counts to make interface lively
  const computedSummary = useMemo(() => {
    if (!summary) return null;

    // Adjust summary metrics based on filters to show mock dynamics
    const tripActiveCount = filteredTrips.filter(t => t.status === "Active").length;
    const tripCompletedCount = filteredTrips.filter(t => t.status === "Completed").length;
    const tripPendingCount = filteredTrips.filter(t => t.status === "Scheduled").length;
    const tripCancelledCount = filteredTrips.filter(t => t.status === "Cancelled").length;

    let utilization = summary.financials.utilization;
    if (filters.vehicleType) {
      // Shift utilization slightly for demo feedback
      utilization = filters.vehicleType === "Heavy Truck" ? 84.2 : 68.1;
    }

    return {
      ...summary,
      trips: {
        active: tripActiveCount || summary.trips.active,
        pending: tripPendingCount || summary.trips.pending,
        completed: tripCompletedCount || summary.trips.completed,
        cancelled: tripCancelledCount || summary.trips.cancelled
      },
      financials: {
        ...summary.financials,
        utilization
      }
    };
  }, [summary, filteredTrips, filters.vehicleType]);

  return {
    isLoading,
    error,
    summary: computedSummary,
    charts,
    trips: filteredTrips,
    maintenance: filteredMaintenance,
    fuel,
    expenses,
    notifications,
    filters,
    searchTerm,
    setSearchTerm,
    updateFilter,
    resetFilters,
    refresh
  };
};

export default useDashboard;
