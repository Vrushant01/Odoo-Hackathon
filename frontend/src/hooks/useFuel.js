import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import fuelService from "../services/fuelService";
import { useGlobalFilters } from "../contexts/FilterContext";
import { performBulkExport } from "../utils/exportHelper";

export const useFuel = () => {
  const [fuelLogs, setFuelLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [summaryCounts, setSummaryCounts] = useState({ totalLogs: 0, totalFuelUsed: 0, totalFuelCost: 0, avgPrice: 0 });

  // Global filters from context
  const { globalFilters } = useGlobalFilters();

  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    vehicleType: "",
    fuelType: "",
    station: "",
    dateRange: { start: "", end: "" }
  });

  // Sorting State
  const [sorting, setSorting] = useState({
    field: "date",
    order: "desc"
  });

  // Pagination State
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  });

  // Row Selection (Bulk Actions)
  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch fuel stats from backend
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/fuel/statistics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("transitops_token") || sessionStorage.getItem("transitops_token")}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setSummaryCounts({
          totalLogs: data.data.totalFuelLogs || 0,
          totalFuelUsed: data.data.totalFuelLiters || 0,
          totalFuelCost: data.data.totalCost || 0,
          avgPrice: data.data.averagePricePerUnit || 0
        });
      }
    } catch (e) {
      console.error("Failed to load fuel statistics:", e);
    }
  }, []);

  // Fetch fuel logs
  const fetchFuel = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setError(null);

    try {
      const res = await fuelService.getFuelLogs({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: searchTerm,
        sort: sorting.field,
        sortOrder: sorting.order,
        // Global filter passthrough
        vehicleType: globalFilters.vehicleType,
        startDate: globalFilters.startDate,
        endDate: globalFilters.endDate
      });

      if (res && res.fuelLogs) {
        setFuelLogs(res.fuelLogs);
        setPageCount(res.pagination.totalPages);
        setTotalCount(res.pagination.totalResults);
      } else {
        setFuelLogs(res);
        setPageCount(1);
        setTotalCount(res.length);
      }
      fetchStats();
    } catch (err) {
      console.error(err);
      setError("Failed to fetch fuel logs.");
      toast.error("Failed to load fuel registry.");
    } finally {
      setIsLoading(false);
    }
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    searchTerm,
    sorting.field,
    sorting.order,
    // Global filter dependencies
    globalFilters.vehicleType,
    globalFilters.startDate,
    globalFilters.endDate,
    fetchStats
  ]);

  useEffect(() => {
    fetchFuel();
  }, [fetchFuel]);

  const refresh = useCallback(() => {
    fetchFuel(true);
    setSelectedIds([]);
    toast.success("Fuel logs registry refreshed.");
  }, [fetchFuel]);

  // Filters Handler
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      vehicleType: "",
      fuelType: "",
      station: "",
      dateRange: { start: "", end: "" }
    });
    setSearchTerm("");
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setSelectedIds([]);
    toast.success("Filters reset successfully.");
  }, []);

  // CRUD Operations
  const addFuelLog = async (data) => {
    try {
      const newLog = await fuelService.createFuelLog(data);
      toast.success(`Fuel log ${newLog.invoiceNumber} created.`);
      fetchFuel(true);
      return newLog;
    } catch (err) {
      toast.error(err.message || "Failed to create fuel log.");
      throw err;
    }
  };

  const editFuelLog = async (id, data) => {
    try {
      const updated = await fuelService.updateFuelLog(id, data);
      toast.success(`Fuel log ${updated.invoiceNumber} updated.`);
      fetchFuel(true);
      return updated;
    } catch (err) {
      toast.error(err.message || "Failed to update fuel log.");
      throw err;
    }
  };

  const deleteFuelLog = async (id) => {
    try {
      await fuelService.deleteFuelLog(id);
      toast.success("Fuel log deleted successfully.");
      fetchFuel(true);
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    } catch (err) {
      toast.error("Failed to delete fuel log.");
    }
  };

  // Bulk Operations
  const bulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await Promise.all(selectedIds.map((id) => fuelService.deleteFuelLog(id)));
      toast.success(`Deleted ${selectedIds.length} fuel logs.`);
      setSelectedIds([]);
      fetchFuel(true);
    } catch (err) {
      toast.error("Bulk delete operation failed.");
    }
  };

  const bulkExport = (format = "csv") => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one fuel log to export.");
      return;
    }
    performBulkExport("fuel", format, selectedIds);
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

  const allVisibleIds = useMemo(() => fuelLogs.map((f) => f.id), [fuelLogs]);

  return {
    fuelLogs,
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
    addFuelLog,
    editFuelLog,
    deleteFuelLog,
    bulkDelete,
    bulkExport,
    refresh
  };
};

export default useFuel;
