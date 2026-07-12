import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import vehicleService from "../services/vehicleService";
import { useGlobalFilters } from "../contexts/FilterContext";

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [summaryCounts, setSummaryCounts] = useState({ total: 0, available: 0, onTrip: 0, maintenance: 0, retired: 0 });

  // Global filters from context
  const { globalFilters } = useGlobalFilters();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    region: "",
    minLoadCapacity: "",
    maxLoadCapacity: "",
    acquisitionYear: "",
    maintenanceStatus: ""
  });

  // Sorting State
  const [sorting, setSorting] = useState({
    field: "plateNumber",
    order: "asc"
  });

  // Pagination State
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  });

  // Row Selection (Bulk Actions)
  const [selectedIds, setSelectedIds] = useState([]);

  // Expose statistics endpoint in service or locally
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/vehicles/statistics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("transitops_token") || sessionStorage.getItem("transitops_token")}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setSummaryCounts({
          total: data.data.totalVehicles || 0,
          available: data.data.available || 0,
          onTrip: data.data.onTrip || 0,
          maintenance: data.data.inShop || 0,
          retired: data.data.retired || 0
        });
      }
    } catch (e) {
      console.error("Failed to load vehicle statistics:", e);
    }
  }, []);

  // Fetch Vehicles from backend with parameters
  const fetchVehicles = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setError(null);

    try {
      const res = await vehicleService.getVehicles({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: searchTerm,
        sort: sorting.field,
        sortOrder: sorting.order,
        // Page-level filters
        type: filters.type || globalFilters.vehicleType,
        status: filters.status || globalFilters.vehicleStatus,
        region: filters.region || globalFilters.region,
        // Date range from global filters
        startDate: globalFilters.startDate,
        endDate: globalFilters.endDate
      });

      if (res && res.vehicles) {
        setVehicles(res.vehicles);
        setPageCount(res.pagination.totalPages);
        setTotalCount(res.pagination.totalResults);
      } else {
        setVehicles(res);
        setPageCount(1);
        setTotalCount(res.length);
      }
      fetchStats();
    } catch (err) {
      console.error(err);
      setError("Failed to fetch vehicles list.");
      toast.error("Failed to load vehicle registry.");
    } finally {
      setIsLoading(false);
    }
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    searchTerm,
    sorting.field,
    sorting.order,
    filters.type,
    filters.status,
    filters.region,
    // Global filter dependencies
    globalFilters.vehicleType,
    globalFilters.vehicleStatus,
    globalFilters.region,
    globalFilters.startDate,
    globalFilters.endDate,
    fetchStats
  ]);

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
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
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

  const allVisibleIds = useMemo(() => vehicles.map((v) => v.id), [vehicles]);

  return {
    vehicles,
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
