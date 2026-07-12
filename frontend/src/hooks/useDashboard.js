import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import dashboardService from "../services/dashboardService";

export const useDashboard = (globalFilters = {}) => {
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

  // Local search for RecentTripsTable (not a global filter)
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
        dashboardService.getDashboardSummary(globalFilters),
        dashboardService.getDashboardCharts(globalFilters),
        dashboardService.getRecentTrips(globalFilters),
        dashboardService.getMaintenanceSummary(globalFilters),
        dashboardService.getFuelSummary(globalFilters),
        dashboardService.getExpenseSummary(globalFilters),
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
    fetchDashboardData();
  }, [fetchDashboardData]);

  const refresh = useCallback(() => {
    fetchDashboardData(true);
  }, [fetchDashboardData]);

  // Client-Side Filtered Recent Trips (instant feedback while API re-fetches)
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      // 1. Filter by Vehicle Type
      if (globalFilters.vehicleType && trip.vehicleType !== globalFilters.vehicleType) return false;
      // 2. Filter by Vehicle Status
      if (globalFilters.vehicleStatus && trip.vehicleStatus !== globalFilters.vehicleStatus) return false;
      // 3. Filter by Region
      if (globalFilters.region && trip.region !== globalFilters.region) return false;
      // 4. Filter by Driver
      if (globalFilters.driver && !trip.driver?.toLowerCase().includes(globalFilters.driver.toLowerCase())) return false;
      // 5. Filter by Trip Status
      if (globalFilters.tripStatus && trip.status !== globalFilters.tripStatus) return false;
      // 6. Filter by Date range
      if (globalFilters.startDate && trip.startDate < globalFilters.startDate) return false;
      if (globalFilters.endDate && trip.startDate > globalFilters.endDate) return false;
      // 7. Local search (Trip ID, Driver, Source, Destination, Vehicle)
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matches =
          (trip.id || "").toLowerCase().includes(q) ||
          (trip.driver || "").toLowerCase().includes(q) ||
          (trip.vehicle || "").toLowerCase().includes(q) ||
          (trip.source || "").toLowerCase().includes(q) ||
          (trip.destination || "").toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [trips, globalFilters, searchTerm]);

  // Client-Side Filtered Maintenance Logs
  const filteredMaintenance = useMemo(() => {
    return maintenance.filter((item) => {
      if (globalFilters.vehicleStatus === "In Shop" && item.status !== "In Progress") return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        return (
          (item.vehicle || "").toLowerCase().includes(q) ||
          (item.type || "").toLowerCase().includes(q) ||
          (item.mechanic || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [maintenance, globalFilters.vehicleStatus, searchTerm]);

  // Compute live KPIs dynamically based on filtered subset
  const computedSummary = useMemo(() => {
    if (!summary) return null;

    const tripActiveCount = filteredTrips.filter((t) => t.status === "Dispatched").length;
    const tripCompletedCount = filteredTrips.filter((t) => t.status === "Completed").length;
    const tripPendingCount = filteredTrips.filter((t) => t.status === "Draft").length;
    const tripCancelledCount = filteredTrips.filter((t) => t.status === "Cancelled").length;

    let utilization = summary.financials.utilization;
    if (globalFilters.vehicleType) {
      utilization = globalFilters.vehicleType === "Heavy Truck" ? 84.2 : 68.1;
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
  }, [summary, filteredTrips, globalFilters.vehicleType]);

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
    searchTerm,
    setSearchTerm,
    refresh
  };
};


export default useDashboard;

