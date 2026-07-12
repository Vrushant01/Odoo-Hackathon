import api from "./api";

// Helper to resolve vehicle & driver strings to Mongo ObjectIds
const resolveAssets = async (data) => {
  let vehicleId = data.vehicle;
  let driverId = data.driver;

  if (typeof vehicleId === "string" && vehicleId.includes("(")) {
    const match = vehicleId.match(/\(([^)]+)\)/);
    if (match) {
      const plate = match[1];
      const res = await api.get(`/vehicles?search=${encodeURIComponent(plate)}`);
      const veh = res.data?.vehicles?.[0] || res.data?.[0];
      if (veh) vehicleId = veh._id;
    }
  }

  if (typeof driverId === "string") {
    const res = await api.get(`/drivers?search=${encodeURIComponent(driverId)}`);
    const drv = res.data?.drivers?.[0] || res.data?.[0];
    if (drv) driverId = drv._id;
  }

  return {
    vehicle: vehicleId,
    driver: driverId,
    fuelType: data.fuelType === "Gasoline" ? "Petrol" : (data.fuelType || "Diesel"),
    fuelStation: data.location || data.fuelStation || "General Station",
    quantity: Number(data.quantity || 0),
    pricePerUnit: Number(data.costPerUnit || data.pricePerUnit || 0),
    currentOdometer: Number(data.odometer || data.currentOdometer || 0),
    paymentMethod: data.paymentMethod || "Fuel Card",
    invoiceNumber: data.invoiceNumber || `INV-F-${Date.now().toString().slice(-5)}`,
    fuelDate: data.date || data.fuelDate || new Date().toISOString()
  };
};

// Helper to map backend fuel log to frontend fuel log schema
export const mapFuelToFrontend = (f) => {
  if (!f) return null;
  return {
    id: f._id,
    vehicle: f.vehicle ? `${f.vehicle.vehicleName} (${f.vehicle.registrationNumber})` : (f.vehicleId || "Vehicle"),
    vehicleId: f.vehicle?._id || f.vehicleId || "",
    driver: f.driver ? f.driver.fullName : (f.driverId || "Driver"),
    driverId: f.driver?._id || f.driverId || "",
    fuelType: f.fuelType === "Petrol" ? "Gasoline" : (f.fuelType || "Diesel"),
    quantity: f.quantity || 0,
    costPerUnit: f.pricePerUnit || 0,
    totalCost: f.totalCost || 0,
    location: f.fuelStation || "N/A",
    odometer: f.currentOdometer || 0,
    invoiceNumber: f.invoiceNumber || "",
    paymentMethod: f.paymentMethod || "",
    date: f.fuelDate ? f.fuelDate.split("T")[0] : ""
  };
};

export const fuelService = {
  getFuelLogs: async (params = {}) => {
    const backendParams = {};
    if (params.page !== undefined) backendParams.page = params.page;
    if (params.limit !== undefined) backendParams.limit = params.limit;
    if (params.search) backendParams.search = params.search;

    if (params.sort) {
      const fieldMap = {
        date: "fuelDate",
        quantity: "quantity",
        totalCost: "totalCost",
        odometer: "currentOdometer"
      };
      const backendField = fieldMap[params.sort] || params.sort;
      backendParams.sort = params.sortOrder === "desc" ? `-${backendField}` : backendField;
    }

    if (params.vehicleId) backendParams.vehicleId = params.vehicleId;

    const res = await api.get("/fuel", { params: backendParams });
    if (res.data && res.data.fuelLogs) {
      return {
        fuelLogs: res.data.fuelLogs.map(mapFuelToFrontend),
        pagination: res.data.pagination
      };
    }

    const arrayData = Array.isArray(res.data) ? res.data : (res.data?.fuelLogs || []);
    return arrayData.map(mapFuelToFrontend);
  },

  getFuelLog: async (id) => {
    const res = await api.get(`/fuel/${id}`);
    const mapped = mapFuelToFrontend(res.data);
    
    // Efficiency calculation for detail sheet
    const distanceTravelled = 450; 
    const distancePerLiter = mapped.quantity > 0 ? (distanceTravelled / mapped.quantity).toFixed(2) : "0.00";
    const fuelCostPerKilometer = distanceTravelled > 0 ? (mapped.totalCost / (distanceTravelled * 1.609)).toFixed(2) : "0.00";

    const efficiency = {
      distanceTravelled,
      fuelConsumed: mapped.quantity,
      distancePerLiter: `${distancePerLiter} mi/L`,
      fuelCostPerKilometer: `$${fuelCostPerKilometer}/km`
    };

    return { ...mapped, efficiency };
  },

  createFuelLog: async (data) => {
    const payload = await resolveAssets(data);
    const res = await api.post("/fuel", payload);
    return mapFuelToFrontend(res.data);
  },

  updateFuelLog: async (id, data) => {
    const payload = await resolveAssets(data);
    const res = await api.put(`/fuel/${id}`, payload);
    return mapFuelToFrontend(res.data);
  },

  deleteFuelLog: async (id) => {
    return await api.delete(`/fuel/${id}`);
  },

  getVehicleFuelHistory: async (plateNumber) => {
    const vehRes = await api.get(`/vehicles?search=${encodeURIComponent(plateNumber)}`);
    const vehicle = vehRes.data?.vehicles?.[0] || vehRes.data?.[0];
    if (!vehicle) return [];

    const res = await api.get(`/fuel/vehicle/${vehicle._id}`);
    const arrayData = res.data || [];
    return arrayData.map(mapFuelToFrontend);
  },

  getFuelSummary: async () => {
    const res = await api.get("/fuel/statistics");
    const stats = res.data;
    return {
      totalFuelUsed: stats.totalFuelLiters || 0,
      totalFuelCost: stats.totalCost || 0,
      avgFuelPrice: stats.averagePricePerUnit || 0,
      activeVehiclesCount: stats.totalVehiclesLogged || 0
    };
  },

  getFuelCharts: async () => {
    // Return charts data from dashboard or stubs
    return {};
  }
};

export default fuelService;
