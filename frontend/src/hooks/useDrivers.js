import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import driverService from "../services/driverService";
import { useGlobalFilters } from "../contexts/FilterContext";
import { performBulkExport } from "../utils/exportHelper";

export const useDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [summaryCounts, setSummaryCounts] = useState({ total: 0, available: 0, onTrip: 0, offDuty: 0, suspended: 0, expired: 0 });

  // Global filters from context
  const { globalFilters } = useGlobalFilters();

  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    licenseCategory: "",
    licenseExpiry: "",
    safetyScore: "",
    region: "",
    assignedVehicle: "",
    availability: ""
  });

  // Sorting State
  const [sorting, setSorting] = useState({
    field: "name",
    order: "asc"
  });

  // Pagination State
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  });

  // Row Selection (Bulk Actions)
  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch driver statistics
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/drivers/statistics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("transitops_token") || sessionStorage.getItem("transitops_token")}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setSummaryCounts({
          total: data.data.totalDrivers || 0,
          available: data.data.availableDrivers || 0,
          onTrip: data.data.driversOnTrip || 0,
          offDuty: data.data.offDuty || 0,
          suspended: data.data.suspendedDrivers || 0,
          expiredLicense: data.data.expiredLicenses || 0,
          averageSafetyScore: data.data.averageSafetyScore || 100
        });
      }
    } catch (e) {
      console.error("Failed to load driver statistics:", e);
    }
  }, []);

  // Fetch drivers list
  const fetchDrivers = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setError(null);

    try {
      const res = await driverService.getDrivers({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        // Local search merged with global driver name filter
        search: searchTerm || globalFilters.driver,
        sort: sorting.field,
        sortOrder: sorting.order,
        status: filters.status,
        // Page-level region merged with global region filter
        region: filters.region || globalFilters.region,
        // Date range from global filters
        startDate: globalFilters.startDate,
        endDate: globalFilters.endDate
      });

      if (res && res.drivers) {
        setDrivers(res.drivers);
        setPageCount(res.pagination.totalPages);
        setTotalCount(res.pagination.totalResults);
      } else {
        setDrivers(res);
        setPageCount(1);
        setTotalCount(res.length);
      }
      fetchStats();
    } catch (err) {
      console.error(err);
      setError("Failed to fetch drivers list.");
      toast.error("Failed to load driver roster.");
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
    filters.region,
    // Global filter dependencies
    globalFilters.driver,
    globalFilters.region,
    globalFilters.startDate,
    globalFilters.endDate,
    fetchStats
  ]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const refresh = useCallback(() => {
    fetchDrivers(true);
    setSelectedIds([]);
    toast.success("Driver roster refreshed.");
  }, [fetchDrivers]);

  // Filter Updates
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      status: "",
      licenseCategory: "",
      licenseExpiry: "",
      safetyScore: "",
      region: "",
      assignedVehicle: "",
      availability: ""
    });
    setSearchTerm("");
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setSelectedIds([]);
    toast.success("Filters reset successfully.");
  }, []);

  // CRUD callbacks
  const addDriver = async (data) => {
    try {
      const newDrv = await driverService.createDriver(data);
      toast.success(`Driver ${newDrv.name} registered successfully.`);
      fetchDrivers(true);
      return newDrv;
    } catch (err) {
      toast.error(err.message || "Failed to register driver.");
      throw err;
    }
  };

  const editDriver = async (id, data) => {
    try {
      const updated = await driverService.updateDriver(id, data);
      toast.success(`Driver ${updated.name} profile updated.`);
      fetchDrivers(true);
      return updated;
    } catch (err) {
      toast.error(err.message || "Failed to update driver details.");
      throw err;
    }
  };

  const deleteDriver = async (id) => {
    try {
      await driverService.deleteDriver(id);
      toast.success("Driver profile deleted.");
      fetchDrivers(true);
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    } catch (err) {
      toast.error("Failed to delete driver.");
    }
  };

  const suspendDriver = async (id, suspensionDetails) => {
    try {
      const suspended = await driverService.suspendDriver(id, suspensionDetails);
      toast.success(`Driver ${suspended.name} has been suspended.`);
      fetchDrivers(true);
    } catch (err) {
      toast.error("Failed to suspend driver.");
    }
  };

  const activateDriver = async (id) => {
    try {
      const activated = await driverService.activateDriver(id);
      toast.success(`Driver ${activated.name} is now active.`);
      fetchDrivers(true);
    } catch (err) {
      toast.error("Failed to activate driver.");
    }
  };

  // Bulk Operations
  const bulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await Promise.all(selectedIds.map((id) => driverService.deleteDriver(id)));
      toast.success(`Deleted ${selectedIds.length} driver profiles.`);
      setSelectedIds([]);
      fetchDrivers(true);
    } catch (err) {
      toast.error("Bulk delete operation failed.");
    }
  };

  const bulkExport = (format = "csv") => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one driver to export.");
      return;
    }
    performBulkExport("drivers", format, selectedIds);
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

  const allVisibleIds = useMemo(() => drivers.map((d) => d.id), [drivers]);

  return {
    drivers,
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
    addDriver,
    editDriver,
    deleteDriver,
    suspendDriver,
    activateDriver,
    bulkDelete,
    bulkExport,
    refresh
  };
};

export default useDrivers;
