import api from "./api";

// Helper to resolve vehicle string to Mongo ObjectId
const resolveVehicle = async (vehicle) => {
  let vehicleId = vehicle;
  if (typeof vehicleId === "string" && vehicleId.includes("(")) {
    const match = vehicleId.match(/\(([^)]+)\)/);
    if (match) {
      const plate = match[1];
      const res = await api.get(`/vehicles?search=${encodeURIComponent(plate)}`);
      const veh = res.data?.vehicles?.[0] || res.data?.[0];
      if (veh) vehicleId = veh._id;
    }
  }
  return vehicleId;
};

// Helper to map backend expense to frontend expense schema
export const mapExpenseToFrontend = (e) => {
  if (!e) return null;
  return {
    id: e._id,
    vehicle: e.vehicle ? `${e.vehicle.vehicleName} (${e.vehicle.registrationNumber})` : (e.vehicleId || "Vehicle"),
    vehicleId: e.vehicle?._id || e.vehicleId || "",
    tripId: e.trip || "",
    expenseType: e.expenseType || "General",
    vendor: e.vendor || "N/A",
    amount: e.amount || 0,
    paymentMethod: e.paymentMethod || "Corporate Card",
    invoiceNumber: e.invoiceNumber || "",
    paymentStatus: e.paymentStatus || "Paid",
    date: e.expenseDate ? e.expenseDate.split("T")[0] : ""
  };
};

export const expenseService = {
  getExpenses: async (params = {}) => {
    const backendParams = {};
    if (params.page !== undefined) backendParams.page = params.page;
    if (params.limit !== undefined) backendParams.limit = params.limit;
    if (params.search) backendParams.search = params.search;

    if (params.sort) {
      const fieldMap = {
        date: "expenseDate",
        amount: "amount",
        expenseType: "expenseType",
        paymentStatus: "paymentStatus"
      };
      const backendField = fieldMap[params.sort] || params.sort;
      backendParams.sort = params.sortOrder === "desc" ? `-${backendField}` : backendField;
    }

    if (params.status) backendParams.paymentStatus = params.status;
    if (params.type) backendParams.expenseType = params.type;

    const res = await api.get("/expenses", { params: backendParams });
    if (res.data && res.data.expenses) {
      return {
        expenses: res.data.expenses.map(mapExpenseToFrontend),
        pagination: res.data.pagination
      };
    }

    const arrayData = Array.isArray(res.data) ? res.data : (res.data?.expenses || []);
    return arrayData.map(mapExpenseToFrontend);
  },

  getExpense: async (id) => {
    const res = await api.get(`/expenses/${id}`);
    const mapped = mapExpenseToFrontend(res.data);
    
    // Fallbacks for vendor details in spec tab
    const vendorInfo = {
      name: mapped.vendor,
      contact: "Support (+1 555-8833-221)",
      email: `billing@${mapped.vendor.toLowerCase().replace(/[^a-z]/g, "") || "vendor"}.com`,
      rating: "4.8"
    };

    const tripBreakdown = {
      fuel: mapped.expenseType === "Fuel" ? mapped.amount : 0,
      maintenance: mapped.expenseType === "Maintenance" ? mapped.amount : 0,
      tolls: mapped.expenseType === "Toll" ? mapped.amount : 0,
      other: mapped.expenseType !== "Fuel" && mapped.expenseType !== "Maintenance" && mapped.expenseType !== "Toll" ? mapped.amount : 0,
      total: mapped.amount
    };

    return { ...mapped, vendorInfo, tripBreakdown };
  },

  createExpense: async (data) => {
    const vehicleId = await resolveVehicle(data.vehicle);
    const payload = {
      vehicle: vehicleId,
      trip: data.tripId || undefined,
      expenseType: data.expenseType,
      vendor: data.vendor,
      amount: Number(data.amount || 0),
      paymentMethod: data.paymentMethod || "Corporate Card",
      invoiceNumber: data.invoiceNumber || `INV-${Date.now().toString().slice(-6)}`,
      paymentStatus: data.paymentStatus || "Paid",
      expenseDate: data.date || data.expenseDate || new Date().toISOString()
    };

    const res = await api.post("/expenses", payload);
    return mapExpenseToFrontend(res.data);
  },

  updateExpense: async (id, data) => {
    const vehicleId = await resolveVehicle(data.vehicle);
    const payload = {
      vehicle: vehicleId,
      trip: data.tripId || undefined,
      expenseType: data.expenseType,
      vendor: data.vendor,
      amount: Number(data.amount || 0),
      paymentMethod: data.paymentMethod,
      invoiceNumber: data.invoiceNumber,
      paymentStatus: data.paymentStatus,
      expenseDate: data.date || data.expenseDate
    };

    const res = await api.put(`/expenses/${id}`, payload);
    return mapExpenseToFrontend(res.data);
  },

  deleteExpense: async (id) => {
    return await api.delete(`/expenses/${id}`);
  },

  getExpenseSummary: async () => {
    const res = await api.get("/expenses/statistics");
    const stats = res.data;
    return {
      totalExpenses: stats.totalExpenses || 0,
      activeVehiclesCount: stats.totalVehiclesLogged || 0,
      avgExpenseAmount: stats.averageExpenseAmount || 0,
      categoriesCount: stats.categoryDistribution?.length || 0
    };
  },

  getExpenseCharts: async () => {
    return {};
  }
};

export default expenseService;
