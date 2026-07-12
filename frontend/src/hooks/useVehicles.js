import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import vehicleService from "../services/vehicleService";

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    region: "",
    minLoadCapacity: "",
    maxLoadCapacity: "",
    acquisitionYear: "",
    maintenanceStatus: "" // 'due' | 'ok'
  });

  // Sorting State
  const [sorting, setSorting] = useState({
    field: "plateNumber",
    order: "asc" // 'asc' | 'desc'
  });

  // Pagination State
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  });

  // Row Selection (Bulk Actions)
  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch Vehicles
  const fetchVehicles = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setError(null);

    try {
      const data = await vehicleService.getVehicles();
      setVehicles(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch vehicles list.");
      toast.error("Failed to load vehicle registry.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const refresh = useCallback(() => {
    fetchVehicles(true);
    setSelectedIds([]);
    toast.success("Vehicle registry refreshed.");
  }, [fetchVehicles]);

  // Filters Handler
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 })); // Reset page on filter
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      type: "",
      status: "",
      region: "",
      minLoadCapacity: "",
      maxLoadCapacity: "",
      acquisitionYear: "",
      maintenanceStatus: ""
    });
    setSearchTerm("");
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setSelectedIds([]);
    toast.success("Filters reset successfully.");
  }, []);

  // CRUD Operations
  const addVehicle = async (data) => {
    try {
      const newVeh = await vehicleService.createVehicle(data);
      toast.success(`Vehicle ${newVeh.plateNumber} registered successfully.`);
      fetchVehicles(true);
      return newVeh;
    } catch (err) {
      toast.error(err.message || "Failed to register vehicle.");
      throw err;
    }
  };

  const editVehicle = async (id, data) => {
    try {
      const updated = await vehicleService.updateVehicle(id, data);
      toast.success(`Vehicle ${updated.plateNumber} updated successfully.`);
      fetchVehicles(true);
      return updated;
    } catch (err) {
      toast.error(err.message || "Failed to update vehicle details.");
      throw err;
    }
  };

  const deleteVehicle = async (id) => {
    try {
      await vehicleService.deleteVehicle(id);
      toast.success("Vehicle deleted successfully.");
      fetchVehicles(true);
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    } catch (err) {
      toast.error("Failed to delete vehicle.");
    }
  };

  const retireVehicle = async (id) => {
    try {
      const retired = await vehicleService.retireVehicle(id);
      toast.success(`Vehicle ${retired.plateNumber} has been retired.`);
      fetchVehicles(true);
    } catch (err) {
      toast.error(err.message || "Failed to retire vehicle.");
    }
  };

  const duplicateVehicle = async (id) => {
    try {
      const target = vehicles.find((v) => v.id === id);
      if (!target) throw new Error("Vehicle not found");

      const duplicateData = {
        ...target,
        plateNumber: `${target.plateNumber}-DUP`,
        status: "Available",
        odometer: 0,
        notes: `Duplicate record of ${target.plateNumber}.`
      };
      // Omit id and system generated fields
      delete duplicateData.id;
      
      await addVehicle(duplicateData);
    } catch (err) {
      toast.error("Failed to duplicate vehicle.");
    }
  };

  // Bulk Operations
  const bulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await Promise.all(selectedIds.map((id) => vehicleService.deleteVehicle(id)));
      toast.success(`Deleted ${selectedIds.length} vehicles.`);
      setSelectedIds([]);
      fetchVehicles(true);
    } catch (err) {
      toast.error("Bulk delete operation failed.");
    }
  };

  const bulkExport = (format = "csv") => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one vehicle to export.");
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

  // KPI summary counters derived from actual list
  const summaryCounts = useMemo(() => {
    const counts = { total: 0, available: 0, onTrip: 0, maintenance: 0, retired: 0 };
    vehicles.forEach((v) => {
      if (v.deleted) return;
      counts.total++;
      if (v.status === "Available" || v.status === "online") counts.available++;
      else if (v.status === "On Trip" || v.status === "on-trip" || v.status === "on duty") counts.onTrip++;
      else if (v.status === "In Shop" || v.status === "Maintenance") counts.maintenance++;
      else if (v.status === "Retired") counts.retired++;
    });
    return counts;
  }, [vehicles]);

  // Client-Side Search, Filter & Sort Logic
  const filteredAndSortedVehicles = useMemo(() => {
    let result = [...vehicles];

    // 1. Search filter
    if (searchTerm) {
      const termLower = searchTerm.toLowerCase();
      result = result.filter(
        (v) =>
          v.plateNumber.toLowerCase().includes(termLower) ||
          v.name.toLowerCase().includes(termLower) ||
          v.model.toLowerCase().includes(termLower) ||
          v.type.toLowerCase().includes(termLower) ||
          v.status.toLowerCase().includes(termLower)
      );
    }

    // 2. Advanced filters
    if (filters.type) {
      result = result.filter((v) => v.type === filters.type);
    }
    if (filters.status) {
      result = result.filter((v) => v.status === filters.status);
    }
    if (filters.region) {
      result = result.filter((v) => v.region === filters.region);
    }
    if (filters.minLoadCapacity) {
      result = result.filter((v) => v.loadCapacity >= Number(filters.minLoadCapacity));
    }
    if (filters.maxLoadCapacity) {
      result = result.filter((v) => v.loadCapacity <= Number(filters.maxLoadCapacity));
    }
    if (filters.acquisitionYear) {
      result = result.filter((v) => String(v.year) === filters.acquisitionYear);
    }
    if (filters.maintenanceStatus) {
      const now = new Date();
      result = result.filter((v) => {
        if (!v.nextMaintenance) return false;
        const dueDate = new Date(v.nextMaintenance);
        const isDue = dueDate <= now;
        return filters.maintenanceStatus === "due" ? isDue : !isDue;
      });
    }

    // 3. Sorting
    if (sorting.field) {
      const f = sorting.field;
      const orderMultiplier = sorting.order === "asc" ? 1 : -1;

      result.sort((a, b) => {
        let valA = a[f];
        let valB = b[f];

        // String conversions
        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();

        if (valA < valB) return -1 * orderMultiplier;
        if (valA > valB) return 1 * orderMultiplier;
        return 0;
      });
    }

    return result;
  }, [vehicles, searchTerm, filters, sorting]);

  // Paginated Results
  const paginatedVehicles = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredAndSortedVehicles.slice(start, end);
  }, [filteredAndSortedVehicles, pagination]);

  const pageCount = Math.ceil(filteredAndSortedVehicles.length / pagination.pageSize);

  return {
    vehicles: paginatedVehicles,
    totalCount: filteredAndSortedVehicles.length,
    allVisibleIds: paginatedVehicles.map(v => v.id),
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
    addVehicle,
    editVehicle,
    deleteVehicle,
    retireVehicle,
    duplicateVehicle,
    bulkDelete,
    bulkExport,
    refresh
  };
};

export default useVehicles;
