import { MOCK_EXPENSES } from "../mock-data/expenses";
import { MOCK_EXPENSE_SUMMARY } from "../mock-data/expenseSummary";
import { MOCK_EXPENSE_CHARTS } from "../mock-data/expenseCharts";
import { MOCK_TRIP_EXPENSES } from "../mock-data/tripExpenses";
import { MOCK_VENDORS } from "../mock-data/vendors";
import { mockResponse } from "./apiHelper";

// Session mutable expenses list
let expenses = [...MOCK_EXPENSES];

export const expenseService = {
  getExpenses: async () => {
    const active = expenses.filter((e) => !e.deleted);
    return mockResponse(active, 300);
  },

  getExpense: async (id) => {
    const record = expenses.find((e) => e.id === id && !e.deleted);
    if (!record) throw new Error("Expense record not found or deleted");
    
    // Lookup vendor info
    const vendorInfo = MOCK_VENDORS[record.vendor] || { name: record.vendor, contact: "N/A", email: "N/A", rating: "N/A" };
    
    // Lookup trip expenses breakdown
    const tripBreakdown = MOCK_TRIP_EXPENSES[record.tripId] || { fuel: 0, maintenance: 0, tolls: 0, other: 0, total: 0 };

    return mockResponse({
      ...record,
      vendorInfo,
      tripBreakdown
    }, 200);
  },

  createExpense: async (data) => {
    const newExp = {
      ...data,
      id: `exp-${Math.floor(1000 + Math.random() * 9000)}`,
      amount: Number(data.amount || 0),
      date: data.date || data.expenseDate || new Date().toISOString().split("T")[0],
      deleted: false
    };

    expenses.unshift(newExp);
    return mockResponse(newExp, 300);
  },

  updateExpense: async (id, data) => {
    let updated = null;
    expenses = expenses.map((e) => {
      if (e.id === id) {
        updated = {
          ...e,
          ...data,
          amount: data.amount ? Number(data.amount) : e.amount,
          date: data.date || data.expenseDate || e.date
        };
        return updated;
      }
      return e;
    });

    if (!updated) throw new Error("Expense not found");
    return mockResponse(updated, 300);
  },

  deleteExpense: async (id) => {
    expenses = expenses.map((e) => (e.id === id ? { ...e, deleted: true } : e));
    return mockResponse({ success: true }, 200);
  },

  getExpenseSummary: async () => {
    return mockResponse(MOCK_EXPENSE_SUMMARY, 200);
  },

  getExpenseCharts: async () => {
    return mockResponse(MOCK_EXPENSE_CHARTS, 200);
  }
};

export default expenseService;
