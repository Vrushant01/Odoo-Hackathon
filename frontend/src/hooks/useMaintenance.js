import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import maintenanceService from "../services/maintenanceService";
import { useGlobalFilters } from "../contexts/FilterContext";

export const useMaintenance = () => {
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [summaryCounts, setSummaryCounts] = useState({ total: 0, scheduled: 0, inProgress: 0, completed: 0, cancelled: 0 });

  // Global filters from context
  const { globalFilters } = useGlobalFilters();

  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    category: "",
    workshop: "",
    dateRange: { start: "", end: "" }
  });

  // Sorting State
  const [sorting, setSorting] = useState({
    field: "scheduledDate",
    order: "asc"
  });

  // Pagination State
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  });

  // Row Selection (Bulk Actions)
  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch stats from backend
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/maintenance/statistics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("transitops_token") || sessionStorage.getItem("transitops_token")}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setSummaryCounts({
          total: data.data.totalLogs || 0,
          scheduled: data.data.scheduled || 0,
          inProgress: data.data.inProgress || 0,
          completed: data.data.completed || 0,
          cancelled: data.data.cancelled || 0
        });
      }
    } catch (e) {
      console.error("Failed to load maintenance statistics:", e);
    }
  }, []);

  // Fetch Maintenance list
  const fetchMaintenance = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setError(null);

    try {
      const res = await maintenanceService.getMaintenance({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: searchTerm,
        sort: sorting.field,
        sortOrder: sorting.order,
        status: filters.status,
        priority: filters.priority,
        // Global date range
        startDate: globalFilters.startDate,
        endDate: globalFilters.endDate
      });

      if (res && res.maintenance) {
        setMaintenanceRecords(res.maintenance);
        setPageCount(res.pagination.totalPages);
        setTotalCount(res.pagination.totalResults);
      } else {
        setMaintenanceRecords(res);
        setPageCount(1);
        setTotalCount(res.length);
      }
      fetchStats();
    } catch (err) {
      console.error(err);
      setError("Failed to fetch maintenance list.");
      toast.error("Failed to load maintenance registry.");
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
    globalFilters.startDate,
    globalFilters.endDate,
    fetchStats
  ]);

  useEffect(() => {
    fetchMaintenance();
  }, [fetchMaintenance]);

  const refresh = useCallback(() => {
    fetchMaintenance(true);
    setSelectedIds([]);
    toast.success("Maintenance registry refreshed.");
  }, [fetchMaintenance]);

  // Filters Handler
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      status: "",
      priority: "",
      category: "",
      workshop: "",
      dateRange: { start: "", end: "" }
    });
    setSearchTerm("");
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setSelectedIds([]);
    toast.success("Filters reset successfully.");
  }, []);

  // CRUD Operations
  const addMaintenance = async (data) => {
    try {
      const newRecord = await maintenanceService.createMaintenance(data);
      toast.success("Maintenance work order created successfully.");
      fetchMaintenance(true);
      return newRecord;
    } catch (err) {
      toast.error(err.message || "Failed to schedule maintenance.");
      throw err;
    }
  };

  const editMaintenance = async (id, data) => {
    try {
      const updated = await maintenanceService.updateMaintenance(id, data);
      toast.success("Maintenance work order updated successfully.");
      fetchMaintenance(true);
      return updated;
    } catch (err) {
      toast.error(err.message || "Failed to update maintenance details.");
      throw err;
    }
  };

  const deleteMaintenance = async (id) => {
    try {
      await maintenanceService.deleteMaintenance(id);
      toast.success("Maintenance log deleted successfully.");
      fetchMaintenance(true);
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    } catch (err) {
      toast.error("Failed to delete maintenance log.");
    }
  };

  const startMaintenance = async (id) => {
    try {
      const started = await maintenanceService.startMaintenance(id);
      toast.success("Maintenance work has been started (In Progress).");
      fetchMaintenance(true);
    } catch (err) {
      toast.error(err.message || "Failed to start maintenance.");
    }
  };

  const completeMaintenance = async (id, details) => {
    try {
      const completed = await maintenanceService.completeMaintenance(id, details);
      toast.success("Maintenance work order marked as completed.");
      fetchMaintenance(true);
    } catch (err) {
      toast.error(err.message || "Failed to complete maintenance.");
    }
  };

  const cancelMaintenance = async (id, details) => {
    try {
      const cancelled = await maintenanceService.cancelMaintenance(id, details);
      toast.success("Maintenance work order has been cancelled.");
      fetchMaintenance(true);
    } catch (err) {
      toast.error(err.message || "Failed to cancel maintenance.");
    }
  };

  // Bulk Operations
  const bulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await Promise.all(selectedIds.map((id) => maintenanceService.deleteMaintenance(id)));
      toast.success(`Deleted ${selectedIds.length} maintenance logs.`);
      setSelectedIds([]);
      fetchMaintenance(true);
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

  const allVisibleIds = useMemo(() => maintenanceRecords.map((m) => m.id), [maintenanceRecords]);

  return {
    maintenanceRecords,
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
