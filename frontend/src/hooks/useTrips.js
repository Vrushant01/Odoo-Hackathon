import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import tripService from "../services/tripService";

export const useTrips = () => {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    vehicle: "",
    driver: "",
    vehicleType: "",
    region: "",
    startDate: "",
    endDate: "",
    minCargoWeight: "",
    maxCargoWeight: "",
    minDistance: "",
    maxDistance: ""
  });

  // Sorting State
  const [sorting, setSorting] = useState({
    field: "id",
    order: "asc"
  });

  // Pagination State
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  });

  // Row Selection (Bulk Actions)
  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch trips list
  const fetchTrips = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setError(null);

    try {
      const data = await tripService.getTrips();
      setTrips(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch trips.");
      toast.error("Failed to load dispatches.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const refresh = useCallback(() => {
    fetchTrips(true);
    setSelectedIds([]);
    toast.success("Dispatches ledger refreshed.");
  }, [fetchTrips]);

  // Filter Updates
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      status: "",
      vehicle: "",
      driver: "",
      vehicleType: "",
      region: "",
      startDate: "",
      endDate: "",
      minCargoWeight: "",
      maxCargoWeight: "",
      minDistance: "",
      maxDistance: ""
    });
    setSearchTerm("");
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setSelectedIds([]);
    toast.success("Filters reset successfully.");
  }, []);

  // CRUD & Lifecycle
  const addTrip = async (data) => {
    try {
      const newTrip = await tripService.createTrip(data);
      toast.success(`Trip ${newTrip.id} scheduled in draft.`);
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
      toast.success(`Trip ${updated.id} details updated.`);
      fetchTrips(true);
      return updated;
    } catch (err) {
      toast.error(err.message || "Failed to update trip.");
      throw err;
    }
  };

  const deleteTrip = async (id) => {
    try {
      await tripService.deleteTrip(id);
      toast.success("Trip soft-deleted successfully.");
      fetchTrips(true);
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    } catch (err) {
      toast.error("Failed to delete trip.");
    }
  };

  const dispatchTrip = async (id, details) => {
    try {
      const dispatched = await tripService.dispatchTrip(id, details);
      toast.success(`Trip ${dispatched.id} has been dispatched!`);
      fetchTrips(true);
      return dispatched;
    } catch (err) {
      toast.error(err.message || "Failed to dispatch trip.");
      throw err;
    }
  };

  const completeTrip = async (id, details) => {
    try {
      const completed = await tripService.completeTrip(id, details);
      toast.success(`Trip ${completed.id} marked as completed.`);
      fetchTrips(true);
      return completed;
    } catch (err) {
      toast.error(err.message || "Failed to complete trip.");
      throw err;
    }
  };

  const cancelTrip = async (id, details) => {
    try {
      const cancelled = await tripService.cancelTrip(id, details);
      toast.success(`Trip ${cancelled.id} marked as cancelled.`);
      fetchTrips(true);
      return cancelled;
    } catch (err) {
      toast.error(err.message || "Failed to cancel trip.");
      throw err;
    }
  };

  const duplicateTrip = async (id) => {
    try {
      const target = trips.find((t) => t.id === id);
      if (!target) throw new Error("Trip not found");

      const duplicateData = {
        ...target,
        status: "Draft",
        dispatchDate: null,
        expectedCompletion: null,
        notes: `Duplicate of ${target.id}.`
      };
      delete duplicateData.id;

      await addTrip(duplicateData);
    } catch (err) {
      toast.error("Failed to duplicate trip.");
    }
  };

  // Bulk Operations
  const bulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await Promise.all(selectedIds.map((id) => tripService.deleteTrip(id)));
      toast.success(`Deleted ${selectedIds.length} trip dispatches.`);
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
    toast.info(`Exporting ${selectedIds.length} dispatches to ${format.toUpperCase()} (Mock).`);
  };

  // Selection helpers
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

  // KPI summary counters derived from active list
  const summaryCounts = useMemo(() => {
    const counts = {
      total: 0,
      draft: 0,
      dispatched: 0,
      completed: 0,
      cancelled: 0,
      active: 0,
      pending: 0,
      totalDistance: 0,
      totalCargo: 0
    };

    trips.forEach((t) => {
      if (t.deleted) return;
      counts.total++;
      if (t.status === "Draft") {
        counts.draft++;
        counts.pending++;
        counts.active++;
      } else if (t.status === "Dispatched") {
        counts.dispatched++;
        counts.active++;
      } else if (t.status === "Completed") {
        counts.completed++;
      } else if (t.status === "Cancelled") {
        counts.cancelled++;
      }

      counts.totalDistance += t.plannedDistance || 0;
      counts.totalCargo += t.cargoWeight || 0;
    });

    return counts;
  }, [trips]);

  // Client-Side Search, Filter & Sort logic
  const filteredAndSortedTrips = useMemo(() => {
    let result = [...trips];

    // 1. Search filter
    if (searchTerm) {
      const termLower = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          t.id.toLowerCase().includes(termLower) ||
          t.driver.toLowerCase().includes(termLower) ||
          t.vehicle.toLowerCase().includes(termLower) ||
          t.source.toLowerCase().includes(termLower) ||
          t.destination.toLowerCase().includes(termLower) ||
          t.status.toLowerCase().includes(termLower)
      );
    }

    // 2. Advanced filters
    if (filters.status) {
      result = result.filter((t) => t.status === filters.status);
    }
    if (filters.driver) {
      result = result.filter((t) => t.driver.toLowerCase().includes(filters.driver.toLowerCase()));
    }
    if (filters.vehicle) {
      result = result.filter((t) => t.vehicle.toLowerCase().includes(filters.vehicle.toLowerCase()));
    }
    if (filters.vehicleType) {
      result = result.filter((t) => t.vehicle.toLowerCase().includes(filters.vehicleType.toLowerCase()));
    }
    if (filters.region) {
      result = result.filter((t) => t.vehicle.toLowerCase().includes(filters.region.toLowerCase()) || t.notes?.toLowerCase().includes(filters.region.toLowerCase()));
    }
    if (filters.minCargoWeight) {
      result = result.filter((t) => t.cargoWeight >= Number(filters.minCargoWeight));
    }
    if (filters.maxCargoWeight) {
      result = result.filter((t) => t.cargoWeight <= Number(filters.maxCargoWeight));
    }
    if (filters.minDistance) {
      result = result.filter((t) => t.plannedDistance >= Number(filters.minDistance));
    }
    if (filters.maxDistance) {
      result = result.filter((t) => t.plannedDistance <= Number(filters.maxDistance));
    }
    if (filters.startDate) {
      result = result.filter((t) => t.createdDate >= filters.startDate);
    }
    if (filters.endDate) {
      result = result.filter((t) => t.createdDate <= filters.endDate);
    }

    // 3. Sorting
    if (sorting.field) {
      const f = sorting.field;
      const orderMultiplier = sorting.order === "asc" ? 1 : -1;

      result.sort((a, b) => {
        let valA = a[f];
        let valB = b[f];

        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();

        if (valA < valB) return -1 * orderMultiplier;
        if (valA > valB) return 1 * orderMultiplier;
        return 0;
      });
    }

    return result;
  }, [trips, searchTerm, filters, sorting]);

  // Paginated Results
  const paginatedTrips = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredAndSortedTrips.slice(start, end);
  }, [filteredAndSortedTrips, pagination]);

  const pageCount = Math.ceil(filteredAndSortedTrips.length / pagination.pageSize);

  return {
    trips: paginatedTrips,
    totalCount: filteredAndSortedTrips.length,
    allVisibleIds: paginatedTrips.map((t) => t.id),
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
    duplicateTrip,
    bulkDelete,
    bulkExport,
    refresh
  };
};

export default useTrips;
