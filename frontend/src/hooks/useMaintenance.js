import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import maintenanceService from "../services/maintenanceService";

export const useMaintenance = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    vehicle: "",
    vehicleType: "",
    type: "",
    status: "",
    priority: "",
    mechanic: "",
    workshop: "",
    startDate: "",
    endDate: "",
    region: ""
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

  // Fetch records
  const fetchRecords = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setError(null);

    try {
      const data = await maintenanceService.getMaintenance();
      setRecords(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch maintenance records.");
      toast.error("Failed to load maintenance ledger.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const refresh = useCallback(() => {
    fetchRecords(true);
    setSelectedIds([]);
    toast.success("Maintenance ledger refreshed.");
  }, [fetchRecords]);

  // Filter Updates
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      vehicle: "",
      vehicleType: "",
      type: "",
      status: "",
      priority: "",
      mechanic: "",
      workshop: "",
      startDate: "",
      endDate: "",
      region: ""
    });
    setSearchTerm("");
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setSelectedIds([]);
    toast.success("Filters reset successfully.");
  }, []);

  // CRUD & Lifecycle callbacks
  const addMaintenance = async (data) => {
    try {
      const newRec = await maintenanceService.createMaintenance(data);
      toast.success(`Maintenance record ${newRec.id} scheduled.`);
      fetchRecords(true);
      return newRec;
    } catch (err) {
      toast.error("Failed to create maintenance record.");
      throw err;
    }
  };

  const editMaintenance = async (id, data) => {
    try {
      const updated = await maintenanceService.updateMaintenance(id, data);
      toast.success(`Maintenance record ${updated.id} updated.`);
      fetchRecords(true);
      return updated;
    } catch (err) {
      toast.error(err.message || "Failed to update maintenance record.");
      throw err;
    }
  };

  const deleteMaintenance = async (id) => {
    try {
      await maintenanceService.deleteMaintenance(id);
      toast.success("Record deleted successfully.");
      fetchRecords(true);
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    } catch (err) {
      toast.error("Failed to delete record.");
    }
  };

  const startMaintenance = async (id) => {
    try {
      const started = await maintenanceService.startMaintenance(id);
      toast.success(`Vehicle grounded. Maintenance started for ${started.id}.`);
      fetchRecords(true);
      return started;
    } catch (err) {
      toast.error("Failed to start maintenance.");
    }
  };

  const completeMaintenance = async (id, details) => {
    try {
      const completed = await maintenanceService.completeMaintenance(id, details);
      toast.success(`Maintenance completed. Vehicle Available.`);
      fetchRecords(true);
      return completed;
    } catch (err) {
      toast.error("Failed to complete maintenance.");
      throw err;
    }
  };

  const cancelMaintenance = async (id, details) => {
    try {
      const cancelled = await maintenanceService.cancelMaintenance(id, details);
      toast.success(`Maintenance task cancelled.`);
      fetchRecords(true);
      return cancelled;
    } catch (err) {
      toast.error("Failed to cancel maintenance.");
      throw err;
    }
  };

  // Bulk Operations
  const bulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await Promise.all(selectedIds.map((id) => maintenanceService.deleteMaintenance(id)));
      toast.success(`Deleted ${selectedIds.length} maintenance records.`);
      setSelectedIds([]);
      fetchRecords(true);
    } catch (err) {
      toast.error("Bulk delete operation failed.");
    }
  };

  const bulkExport = (format = "csv") => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one record to export.");
      return;
    }
    toast.info(`Exporting ${selectedIds.length} records to ${format.toUpperCase()} (Mock).`);
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
      scheduled: 0,
      active: 0,
      completed: 0,
      cancelled: 0,
      inWorkshop: 0,
      overdue: 0,
      avgCost: 0,
      upcoming: 0
    };

    let completedCostSum = 0;
    let completedCount = 0;

    records.forEach((r) => {
      if (r.deleted) return;
      counts.total++;
      if (r.status === "Scheduled") {
        counts.scheduled++;
        counts.upcoming++;
      } else if (r.status === "In Progress") {
        counts.active++;
        counts.inWorkshop++;
      } else if (r.status === "Completed") {
        counts.completed++;
        if (r.cost) {
          completedCostSum += r.cost;
          completedCount++;
        }
      } else if (r.status === "Cancelled") {
        counts.cancelled++;
      } else if (r.status === "Overdue") {
        counts.overdue++;
      }
    });

    counts.avgCost = completedCount > 0 ? Math.round(completedCostSum / completedCount) : 0;
    return counts;
  }, [records]);

  // Client-Side Search, Filter & Sort logic
  const filteredAndSortedRecords = useMemo(() => {
    let result = [...records];

    // 1. Search filter
    if (searchTerm) {
      const termLower = searchTerm.toLowerCase();
      result = result.filter(
        (r) =>
          r.id.toLowerCase().includes(termLower) ||
          r.vehicle.toLowerCase().includes(termLower) ||
          r.type.toLowerCase().includes(termLower) ||
          r.mechanic.toLowerCase().includes(termLower) ||
          r.workshop.toLowerCase().includes(termLower) ||
          r.status.toLowerCase().includes(termLower)
      );
    }

    // 2. Advanced filters
    if (filters.status) {
      result = result.filter((r) => r.status === filters.status);
    }
    if (filters.priority) {
      result = result.filter((r) => r.priority === filters.priority);
    }
    if (filters.type) {
      result = result.filter((r) => r.type === filters.type);
    }
    if (filters.workshop) {
      result = result.filter((r) => r.workshop.toLowerCase().includes(filters.workshop.toLowerCase()));
    }
    if (filters.mechanic) {
      result = result.filter((r) => r.mechanic.toLowerCase().includes(filters.mechanic.toLowerCase()));
    }
    if (filters.vehicle) {
      result = result.filter((r) => r.vehicle.toLowerCase().includes(filters.vehicle.toLowerCase()));
    }
    if (filters.vehicleType) {
      result = result.filter((r) => r.vehicle.toLowerCase().includes(filters.vehicleType.toLowerCase()));
    }
    if (filters.region) {
      result = result.filter((r) => r.workshop.toLowerCase().includes(filters.region.toLowerCase()) || r.remarks?.toLowerCase().includes(filters.region.toLowerCase()));
    }
    if (filters.startDate) {
      result = result.filter((r) => r.scheduledDate >= filters.startDate);
    }
    if (filters.endDate) {
      result = result.filter((r) => r.scheduledDate <= filters.endDate);
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
  }, [records, searchTerm, filters, sorting]);

  // Paginated Results
  const paginatedRecords = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredAndSortedRecords.slice(start, end);
  }, [filteredAndSortedRecords, pagination]);

  const pageCount = Math.ceil(filteredAndSortedRecords.length / pagination.pageSize);

  return {
    records: paginatedRecords,
    totalCount: filteredAndSortedRecords.length,
    allVisibleIds: paginatedRecords.map((r) => r.id),
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
    addMaintenance,
    editMaintenance,
    deleteMaintenance,
    startMaintenance,
    completeMaintenance,
    cancelMaintenance,
    bulkDelete,
    bulkExport,
    refresh
  };
};

export default useMaintenance;
