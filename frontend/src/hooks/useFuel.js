import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import fuelService from "../services/fuelService";

export const useFuel = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Charts & Stats Aggregations
  const [summary, setSummary] = useState(null);
  const [charts, setCharts] = useState(null);

  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    vehicle: "",
    driver: "",
    tripId: "",
    fuelType: "",
    startDate: "",
    endDate: "",
    fuelStation: "",
    region: ""
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

  // Fetch fuel logs
  const fetchFuel = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setError(null);

    try {
      const [logsData, sumData, chartsData] = await Promise.all([
        fuelService.getFuelLogs(),
        fuelService.getFuelSummary(),
        fuelService.getFuelCharts()
      ]);
      setLogs(logsData);
      setSummary(sumData);
      setCharts(chartsData);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch fuel logs.");
      toast.error("Failed to load fuel records.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFuel();
  }, [fetchFuel]);

  const refresh = useCallback(() => {
    fetchFuel(true);
    setSelectedIds([]);
    toast.success("Fuel logs ledger refreshed.");
  }, [fetchFuel]);

  // Filter Updates
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      vehicle: "",
      driver: "",
      tripId: "",
      fuelType: "",
      startDate: "",
      endDate: "",
      fuelStation: "",
      region: ""
    });
    setSearchTerm("");
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setSelectedIds([]);
    toast.success("Filters reset successfully.");
  }, []);

  // CRUD
  const addFuelLog = async (data) => {
    try {
      const newLog = await fuelService.createFuelLog(data);
      toast.success(`Fuel log ${newLog.id} added.`);
      fetchFuel(true);
      return newLog;
    } catch (err) {
      toast.error("Failed to add fuel log.");
      throw err;
    }
  };

  const editFuelLog = async (id, data) => {
    try {
      const updated = await fuelService.updateFuelLog(id, data);
      toast.success(`Fuel log ${updated.id} updated.`);
      fetchFuel(true);
      return updated;
    } catch (err) {
      toast.error("Failed to update fuel log.");
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
      toast.warning("Please select at least one log to export.");
      return;
    }
    toast.info(`Exporting ${selectedIds.length} logs to ${format.toUpperCase()} (Mock).`);
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
    if (summary) return summary;

    // Fallback counts if summary service not loaded
    const counts = {
      totalEntries: 0,
      todaysFuel: 0,
      monthlyFuel: 0,
      totalFuelCost: 0,
      avgFuelEfficiency: "N/A",
      avgFuelPrice: 0,
      highestConsumptionVehicle: "N/A",
      lowestConsumptionVehicle: "N/A"
    };

    logs.forEach((l) => {
      if (l.deleted) return;
      counts.totalEntries++;
      counts.totalFuelCost += l.totalCost || 0;
    });

    return counts;
  }, [logs, summary]);

  // Client-Side Search, Filter & Sort logic
  const filteredAndSortedLogs = useMemo(() => {
    let result = [...logs];

    // 1. Search filter
    if (searchTerm) {
      const termLower = searchTerm.toLowerCase();
      result = result.filter(
        (l) =>
          l.id.toLowerCase().includes(termLower) ||
          l.vehicle.toLowerCase().includes(termLower) ||
          l.driver.toLowerCase().includes(termLower) ||
          l.tripId.toLowerCase().includes(termLower) ||
          l.fuelStation.toLowerCase().includes(termLower) ||
          l.fuelType.toLowerCase().includes(termLower) ||
          l.invoiceNumber.toLowerCase().includes(termLower)
      );
    }

    // 2. Advanced filters
    if (filters.vehicle) {
      result = result.filter((l) => l.vehicle.toLowerCase().includes(filters.vehicle.toLowerCase()));
    }
    if (filters.driver) {
      result = result.filter((l) => l.driver.toLowerCase().includes(filters.driver.toLowerCase()));
    }
    if (filters.tripId) {
      result = result.filter((l) => l.tripId.toLowerCase().includes(filters.tripId.toLowerCase()));
    }
    if (filters.fuelType) {
      result = result.filter((l) => l.fuelType === filters.fuelType);
    }
    if (filters.fuelStation) {
      result = result.filter((l) => l.fuelStation.toLowerCase().includes(filters.fuelStation.toLowerCase()));
    }
    if (filters.region) {
      result = result.filter((l) => l.fuelStation.toLowerCase().includes(filters.region.toLowerCase()) || l.remarks?.toLowerCase().includes(filters.region.toLowerCase()));
    }
    if (filters.startDate) {
      result = result.filter((l) => l.date >= filters.startDate);
    }
    if (filters.endDate) {
      result = result.filter((l) => l.date <= filters.endDate);
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
  }, [logs, searchTerm, filters, sorting]);

  // Paginated Results
  const paginatedLogs = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredAndSortedLogs.slice(start, end);
  }, [filteredAndSortedLogs, pagination]);

  const pageCount = Math.ceil(filteredAndSortedLogs.length / pagination.pageSize);

  return {
    logs: paginatedLogs,
    totalCount: filteredAndSortedLogs.length,
    allVisibleIds: paginatedLogs.map((l) => l.id),
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
    chartsData: charts,
    addFuelLog,
    editFuelLog,
    deleteFuelLog,
    bulkDelete,
    bulkExport,
    refresh
  };
};

export default useFuel;
