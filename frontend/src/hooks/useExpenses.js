import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import expenseService from "../services/expenseService";

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charts & Stats Aggregations
  const [summary, setSummary] = useState(null);
  const [charts, setCharts] = useState(null);

  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    vehicle: "",
    tripId: "",
    vendor: "",
    startDate: "",
    endDate: "",
    status: "",
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

  // Fetch expenses list
  const fetchExpenses = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setError(null);

    try {
      const [expData, sumData, chartsData] = await Promise.all([
        expenseService.getExpenses(),
        expenseService.getExpenseSummary(),
        expenseService.getExpenseCharts()
      ]);
      setExpenses(expData);
      setSummary(sumData);
      setCharts(chartsData);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch expenses.");
      toast.error("Failed to load expenses ledger.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const refresh = useCallback(() => {
    fetchExpenses(true);
    setSelectedIds([]);
    toast.success("Expenses ledger refreshed.");
  }, [fetchExpenses]);

  // Filter Updates
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      type: "",
      vehicle: "",
      tripId: "",
      vendor: "",
      startDate: "",
      endDate: "",
      status: "",
      region: ""
    });
    setSearchTerm("");
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setSelectedIds([]);
    toast.success("Filters reset successfully.");
  }, []);

  // CRUD
  const addExpense = async (data) => {
    try {
      const newExp = await expenseService.createExpense(data);
      toast.success(`Expense ${newExp.id} added.`);
      fetchExpenses(true);
      return newExp;
    } catch (err) {
      toast.error("Failed to add expense record.");
      throw err;
    }
  };

  const editExpense = async (id, data) => {
    try {
      const updated = await expenseService.updateExpense(id, data);
      toast.success(`Expense ${updated.id} details updated.`);
      fetchExpenses(true);
      return updated;
    } catch (err) {
      toast.error("Failed to update expense details.");
      throw err;
    }
  };

  const deleteExpense = async (id) => {
    try {
      await expenseService.deleteExpense(id);
      toast.success("Expense record deleted successfully.");
      fetchExpenses(true);
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    } catch (err) {
      toast.error("Failed to delete expense.");
    }
  };

  // Bulk Operations
  const bulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await Promise.all(selectedIds.map((id) => expenseService.deleteExpense(id)));
      toast.success(`Deleted ${selectedIds.length} expense logs.`);
      setSelectedIds([]);
      fetchExpenses(true);
    } catch (err) {
      toast.error("Bulk delete operation failed.");
    }
  };

  const bulkExport = (format = "csv") => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one expense to export.");
      return;
    }
    toast.info(`Exporting ${selectedIds.length} expenses to ${format.toUpperCase()} (Mock).`);
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

    const counts = {
      totalExpenses: 0,
      fuelExpenses: 0,
      maintenanceExpenses: 0,
      tollExpenses: 0,
      repairExpenses: 0,
      miscExpenses: 0,
      monthlyExpenses: 0,
      avgExpensePerTrip: 0,
      operationalCost: 0
    };

    expenses.forEach((e) => {
      if (e.deleted) return;
      counts.totalExpenses += e.amount || 0;
      counts.operationalCost += e.amount || 0;

      if (e.type === "Fuel") counts.fuelExpenses += e.amount;
      else if (e.type === "Maintenance") counts.maintenanceExpenses += e.amount;
      else if (e.type === "Toll") counts.tollExpenses += e.amount;
      else if (e.type === "Repair") counts.repairExpenses += e.amount;
      else counts.miscExpenses += e.amount;
    });

    return counts;
  }, [expenses, summary]);

  // Client-Side Search, Filter & Sort logic
  const filteredAndSortedExpenses = useMemo(() => {
    let result = [...expenses];

    // 1. Search filter
    if (searchTerm) {
      const termLower = searchTerm.toLowerCase();
      result = result.filter(
        (e) =>
          e.id.toLowerCase().includes(termLower) ||
          e.vehicle.toLowerCase().includes(termLower) ||
          e.tripId.toLowerCase().includes(termLower) ||
          e.type.toLowerCase().includes(termLower) ||
          e.vendor.toLowerCase().includes(termLower) ||
          e.invoiceNumber.toLowerCase().includes(termLower)
      );
    }

    // 2. Advanced filters
    if (filters.type) {
      result = result.filter((e) => e.type === filters.type);
    }
    if (filters.vehicle) {
      result = result.filter((e) => e.vehicle.toLowerCase().includes(filters.vehicle.toLowerCase()));
    }
    if (filters.tripId) {
      result = result.filter((e) => e.tripId.toLowerCase().includes(filters.tripId.toLowerCase()));
    }
    if (filters.vendor) {
      result = result.filter((e) => e.vendor.toLowerCase().includes(filters.vendor.toLowerCase()));
    }
    if (filters.status) {
      result = result.filter((e) => e.status === filters.status);
    }
    if (filters.region) {
      result = result.filter((e) => e.vendor.toLowerCase().includes(filters.region.toLowerCase()) || e.remarks?.toLowerCase().includes(filters.region.toLowerCase()));
    }
    if (filters.startDate) {
      result = result.filter((e) => e.date >= filters.startDate);
    }
    if (filters.endDate) {
      result = result.filter((e) => e.date <= filters.endDate);
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
  }, [expenses, searchTerm, filters, sorting]);

  // Paginated Results
  const paginatedExpenses = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredAndSortedExpenses.slice(start, end);
  }, [filteredAndSortedExpenses, pagination]);

  const pageCount = Math.ceil(filteredAndSortedExpenses.length / pagination.pageSize);

  return {
    expenses: paginatedExpenses,
    totalCount: filteredAndSortedExpenses.length,
    allVisibleIds: paginatedExpenses.map((e) => e.id),
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
    addExpense,
    editExpense,
    deleteExpense,
    bulkDelete,
    bulkExport,
    refresh
  };
};

export default useExpenses;
