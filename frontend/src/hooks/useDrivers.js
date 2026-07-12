import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import driverService from "../services/driverService";

export const useDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    licenseCategory: "",
    licenseExpiry: "", // 'expired' | 'soon' | 'valid'
    safetyScore: "", // 'low' | 'medium' | 'high'
    region: "",
    assignedVehicle: "", // 'assigned' | 'unassigned'
    availability: "" // 'available' | 'busy' | 'suspended'
  });

  // Sorting State
  const [sorting, setSorting] = useState({
    field: "name",
    order: "asc" // 'asc' | 'desc'
  });

  // Pagination State
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5
  });

  // Row Selection (Bulk Actions)
  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch drivers list
  const fetchDrivers = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setError(null);

    try {
      const data = await driverService.getDrivers();
      setDrivers(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch drivers list.");
      toast.error("Failed to load driver roster.");
    } finally {
      setIsLoading(false);
    }
  }, []);

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
      toast.success("Driver profile deleted (soft-delete).");
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
    toast.info(`Exporting ${selectedIds.length} driver logs to ${format.toUpperCase()} (Mock).`);
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

  // KPI Counters derived from actual roster
  const summaryCounts = useMemo(() => {
    const counts = {
      total: 0,
      available: 0,
      onTrip: 0,
      offDuty: 0,
      suspended: 0,
      expiredLicense: 0,
      averageSafetyScore: 0
    };

    let totalSafetySum = 0;
    let safetyDriversCount = 0;
    const today = new Date();

    drivers.forEach((d) => {
      if (d.deleted) return;
      counts.total++;

      // Expiry checks
      if (d.licenseExpiry) {
        const expDate = new Date(d.licenseExpiry);
        if (expDate < today) counts.expiredLicense++;
      }

      // Status counters
      if (d.status === "Available" || d.status === "online") counts.available++;
      else if (d.status === "On Trip" || d.status === "on-trip" || d.status === "on duty") counts.onTrip++;
      else if (d.status === "Off Duty" || d.status === "off-duty") counts.offDuty++;
      else if (d.status === "Suspended") counts.suspended++;
      else if (d.status === "License Expired") counts.suspended++; // Counts under administrative suspended logic

      if (d.safetyScore) {
        totalSafetySum += d.safetyScore;
        safetyDriversCount++;
      }
    });

    counts.averageSafetyScore = safetyDriversCount > 0 ? Math.round(totalSafetySum / safetyDriversCount) : 0;
    return counts;
  }, [drivers]);

  // Client-Side Search, Filter & Sort logic
  const filteredAndSortedDrivers = useMemo(() => {
    let result = [...drivers];

    // 1. Search trigger
    if (searchTerm) {
      const termLower = searchTerm.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(termLower) ||
          d.licenseNumber.toLowerCase().includes(termLower) ||
          d.phone.toLowerCase().includes(termLower) ||
          d.email.toLowerCase().includes(termLower) ||
          (d.assignedVehicle && d.assignedVehicle.toLowerCase().includes(termLower)) ||
          d.status.toLowerCase().includes(termLower) ||
          (d.safetyScore && String(d.safetyScore).includes(termLower))
      );
    }

    // 2. Advanced Filters
    if (filters.status) {
      result = result.filter((d) => d.status === filters.status);
    }
    if (filters.licenseCategory) {
      result = result.filter((d) => d.licenseCategory === filters.licenseCategory);
    }
    if (filters.region) {
      // Regions can be checked via notes or phone prefix, or custom address
      const reg = filters.region.toLowerCase();
      result = result.filter((d) => d.city?.toLowerCase().includes(reg) || d.state?.toLowerCase().includes(reg) || d.notes?.toLowerCase().includes(reg));
    }
    if (filters.assignedVehicle) {
      result = result.filter((d) =>
        filters.assignedVehicle === "assigned" ? !!d.assignedVehicle : !d.assignedVehicle
      );
    }

    // Availability
    if (filters.availability) {
      result = result.filter((d) => {
        if (filters.availability === "available") return d.status === "Available";
        if (filters.availability === "busy") return d.status === "On Trip";
        if (filters.availability === "suspended") return d.status === "Suspended";
        return true;
      });
    }

    // Safety score ranges
    if (filters.safetyScore) {
      result = result.filter((d) => {
        if (filters.safetyScore === "low") return d.safetyScore < 80;
        if (filters.safetyScore === "medium") return d.safetyScore >= 80 && d.safetyScore < 90;
        if (filters.safetyScore === "high") return d.safetyScore >= 90;
        return true;
      });
    }

    // License expiration dates filter
    if (filters.licenseExpiry) {
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);

      result = result.filter((d) => {
        if (!d.licenseExpiry) return false;
        const expDate = new Date(d.licenseExpiry);

        if (filters.licenseExpiry === "expired") {
          return expDate < today;
        }
        if (filters.licenseExpiry === "soon") {
          return expDate >= today && expDate <= thirtyDaysFromNow;
        }
        if (filters.licenseExpiry === "valid") {
          return expDate > thirtyDaysFromNow;
        }
        return true;
      });
    }

    // 3. Sorting
    if (sorting.field) {
      const f = sorting.field;
      const orderMultiplier = sorting.order === "asc" ? 1 : -1;

      result.sort((a, b) => {
        let valA = a[f];
        let valB = b[f];

        if (f === "licenseExpiry") {
          valA = new Date(valA || 0);
          valB = new Date(valB || 0);
        } else {
          if (typeof valA === "string") valA = valA.toLowerCase();
          if (typeof valB === "string") valB = valB.toLowerCase();
        }

        if (valA < valB) return -1 * orderMultiplier;
        if (valA > valB) return 1 * orderMultiplier;
        return 0;
      });
    }

    return result;
  }, [drivers, searchTerm, filters, sorting]);

  // Paginated roster
  const paginatedDrivers = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredAndSortedDrivers.slice(start, end);
  }, [filteredAndSortedDrivers, pagination]);

  const pageCount = Math.ceil(filteredAndSortedDrivers.length / pagination.pageSize);

  return {
    drivers: paginatedDrivers,
    totalCount: filteredAndSortedDrivers.length,
    allVisibleIds: paginatedDrivers.map((d) => d.id),
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
