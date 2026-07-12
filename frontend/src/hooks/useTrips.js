import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import tripService from "../services/tripService";
import { useGlobalFilters } from "../contexts/FilterContext";

export const useTrips = () => {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [summaryCounts, setSummaryCounts] = useState({ total: 0, active: 0, dispatched: 0, completed: 0, cancelled: 0, totalDistance: 0, totalCargo: 0 });

  // Global filters from context
  const { globalFilters } = useGlobalFilters();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    vehicleType: "",
    dateRange: { start: "", end: "" }
  });

  // Sorting State
  const [sorting, setSorting] = useState({
    field: "tripNumber",
    order: "asc"
  });

  // Pagination State
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  });

  // Row Selection (Bulk Actions)
  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch trip statistics
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/trips/statistics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("transitops_token") || sessionStorage.getItem("transitops_token")}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setSummaryCounts({
          total: data.data.totalTrips || 0,
          active: data.data.draftTrips || 0,
          dispatched: data.data.dispatchedTrips || 0,
          completed: data.data.completedTrips || 0,
          cancelled: data.data.cancelledTrips || 0,
          totalDistance: data.data.totalDistance || 0,
          totalCargo: data.data.totalCargo || 0
        });
      }
    } catch (e) {
      console.error("Failed to load trip statistics:", e);
    }
  }, []);

  // Fetch Trips
  const fetchTrips = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setError(null);

    try {
      const res = await tripService.getTrips({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: searchTerm || globalFilters.driver,
        sort: sorting.field,
        sortOrder: sorting.order,
        // Page-level status takes priority; fall back to global trip status
        status: filters.status || globalFilters.tripStatus,
        priority: filters.priority,
        vehicleType: globalFilters.vehicleType,
        startDate: globalFilters.startDate,
        endDate: globalFilters.endDate
      });

      if (res && res.trips) {
        setTrips(res.trips);
        setPageCount(res.pagination.totalPages);
        setTotalCount(res.pagination.totalResults);
      } else {
        setTrips(res);
        setPageCount(1);
        setTotalCount(res.length);
      }
      fetchStats();
    } catch (err) {
      console.error(err);
      setError("Failed to fetch trips list.");
      toast.error("Failed to load dispatch registry.");
    } finally {
      setIsLoading(false);
    }
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    searchTerm,
    sorting.field,
    sorting.order,
    filters.status,
    filters.priority,
    // Global filter dependencies
    globalFilters.driver,
    globalFilters.tripStatus,
    globalFilters.vehicleType,
    globalFilters.startDate,
    globalFilters.endDate,
    fetchStats
  ]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const refresh = useCallback(() => {
    fetchTrips(true);
    setSelectedIds([]);
    toast.success("Dispatch registry refreshed.");
  }, [fetchTrips]);

  // Filters Handler
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      status: "",
      priority: "",
      vehicleType: "",
      dateRange: { start: "", end: "" }
    });
    setSearchTerm("");
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setSelectedIds([]);
    toast.success("Filters reset successfully.");
  }, []);

  // CRUD Operations
  const addTrip = async (data) => {
    try {
      const newTrip = await tripService.createTrip(data);
      toast.success(`Trip ${newTrip.tripNumber} created successfully.`);
      fetchTrips(true);
      return newTrip;
    } catch (err) {
      toast.error(err.message || "Failed to create trip.");
      throw err;
    }
  };

  const editTrip = async (id, data) => {
    try {
      const updated = await tripService.updateTrip(id, data);
      toast.success(`Trip ${updated.tripNumber} updated successfully.`);
      fetchTrips(true);
      return updated;
    } catch (err) {
      toast.error(err.message || "Failed to update trip details.");
      throw err;
    }
  };

  const deleteTrip = async (id) => {
    try {
      await tripService.deleteTrip(id);
      toast.success("Trip deleted successfully.");
      fetchTrips(true);
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    } catch (err) {
      toast.error("Failed to delete trip.");
    }
  };

  const dispatchTrip = async (id, details) => {
    try {
      const dispatched = await tripService.dispatchTrip(id, details);
      toast.success(`Trip ${dispatched.tripNumber} is now dispatched.`);
      fetchTrips(true);
    } catch (err) {
      toast.error(err.message || "Failed to dispatch trip.");
    }
  };

  const completeTrip = async (id, details) => {
    try {
      const completed = await tripService.completeTrip(id, details);
      toast.success(`Trip ${completed.tripNumber} has been completed.`);
      fetchTrips(true);
    } catch (err) {
      toast.error(err.message || "Failed to complete trip.");
    }
  };

  const cancelTrip = async (id, details) => {
    try {
      const cancelled = await tripService.cancelTrip(id, details);
      toast.success(`Trip ${cancelled.tripNumber} has been cancelled.`);
      fetchTrips(true);
    } catch (err) {
      toast.error(err.message || "Failed to cancel trip.");
    }
  };

  // Bulk Operations
  const bulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await Promise.all(selectedIds.map((id) => tripService.deleteTrip(id)));
      toast.success(`Deleted ${selectedIds.length} dispatches.`);
      setSelectedIds([]);
      fetchTrips(true);
    } catch (err) {
      toast.error("Bulk delete operation failed.");
    }
  };

  const bulkExport = (format = "csv") => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one trip to export.");
      return;
    }
    toast.info(`Exporting ${selectedIds.length} records to ${format.toUpperCase()} (Mock).`);
  };

  // Row Selection Helpers
  const toggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (checked, visibleIds) => {
    if (checked) {
      setSelectedIds((prev) => {
        const union = new Set([...prev, ...visibleIds]);
        return Array.from(union);
      });
    } else {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    }
  };

  const allVisibleIds = useMemo(() => trips.map((t) => t.id), [trips]);

  return {
    trips,
    totalCount,
    allVisibleIds,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    resetFilters,
    sorting,
    setSorting,
    pagination,
    setPagination,
    pageCount,
    selectedIds,
    setSelectedIds,
    toggleSelectRow,
    toggleSelectAll,
    summaryCounts,
    addTrip,
    editTrip,
    deleteTrip,
    dispatchTrip,
    completeTrip,
    cancelTrip,
    bulkDelete,
    bulkExport,
    refresh
  };
};

export default useTrips;
