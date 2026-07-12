import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import expenseService from "../services/expenseService";
import { useGlobalFilters } from "../contexts/FilterContext";
import { performBulkExport } from "../utils/exportHelper";

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [summaryCounts, setSummaryCounts] = useState({ totalExpenses: 0, paidCount: 0, pendingCount: 0, rejectedCount: 0 });

  // Global filters from context
  const { globalFilters } = useGlobalFilters();

  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    expenseType: "",
    paymentStatus: "",
    vehicleType: "",
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

  // Fetch expense stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/expenses/statistics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("transitops_token") || sessionStorage.getItem("transitops_token")}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setSummaryCounts({
          totalExpenses: data.data.totalExpenses || 0,
          paidCount: data.data.paidCount || 0,
          pendingCount: data.data.pendingCount || 0,
          rejectedCount: data.data.rejectedCount || 0
        });
      }
    } catch (e) {
      console.error("Failed to load expense statistics:", e);
    }
  }, []);

  // Fetch Expenses list
  const fetchExpenses = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setError(null);

    try {
      const res = await expenseService.getExpenses({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: searchTerm,
        sort: sorting.field,
        sortOrder: sorting.order,
        status: filters.paymentStatus,
        type: filters.expenseType,
        // Global filter passthrough
        vehicleType: globalFilters.vehicleType,
        startDate: globalFilters.startDate,
        endDate: globalFilters.endDate
      });

      if (res && res.expenses) {
        setExpenses(res.expenses);
        setPageCount(res.pagination.totalPages);
        setTotalCount(res.pagination.totalResults);
      } else {
        setExpenses(res);
        setPageCount(1);
        setTotalCount(res.length);
      }
      fetchStats();
    } catch (err) {
      console.error(err);
      setError("Failed to fetch expenses list.");
      toast.error("Failed to load financial records.");
    } finally {
      setIsLoading(false);
    }
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    searchTerm,
    sorting.field,
    sorting.order,
    filters.paymentStatus,
    filters.expenseType,
    // Global filter dependencies
    globalFilters.vehicleType,
    globalFilters.startDate,
    globalFilters.endDate,
    fetchStats
  ]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const refresh = useCallback(() => {
    fetchExpenses(true);
    setSelectedIds([]);
    toast.success("Expense log refreshed.");
  }, [fetchExpenses]);

  // Filters Handler
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      expenseType: "",
      paymentStatus: "",
      vehicleType: "",
      dateRange: { start: "", end: "" }
    });
    setSearchTerm("");
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setSelectedIds([]);
    toast.success("Filters reset successfully.");
  }, []);

  // CRUD Operations
  const addExpense = async (data) => {
    try {
      const newExp = await expenseService.createExpense(data);
      toast.success(`Expense ${newExp.invoiceNumber} logged successfully.`);
      fetchExpenses(true);
      return newExp;
    } catch (err) {
      toast.error(err.message || "Failed to log expense.");
      throw err;
    }
  };

  const editExpense = async (id, data) => {
    try {
      const updated = await expenseService.updateExpense(id, data);
      toast.success(`Expense ${updated.invoiceNumber} updated.`);
      fetchExpenses(true);
      return updated;
    } catch (err) {
      toast.error(err.message || "Failed to update expense.");
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
      toast.error("Failed to delete expense record.");
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
      toast.warning("Please select at least one expense record to export.");
      return;
    }
    performBulkExport("expenses", format, selectedIds);
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

  const allVisibleIds = useMemo(() => expenses.map((e) => e.id), [expenses]);

  return {
    expenses,
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
    addExpense,
    editExpense,
    deleteExpense,
    bulkDelete,
    bulkExport,
    refresh
  };
};

export default useExpenses;
