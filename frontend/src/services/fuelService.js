import { MOCK_FUEL_LOGS } from "../mock-data/fuelLogs";
import { MOCK_FUEL_SUMMARY } from "../mock-data/fuelSummary";
import { MOCK_FUEL_CHARTS } from "../mock-data/fuelCharts";
import { MOCK_VEHICLE_FUEL_HISTORY } from "../mock-data/vehicleFuelHistory";
import { mockResponse } from "./apiHelper";

// Session mutable fuel logs
let fuelLogs = [...MOCK_FUEL_LOGS];

export const fuelService = {
  getFuelLogs: async () => {
    const active = fuelLogs.filter((f) => !f.deleted);
    return mockResponse(active, 300);
  },

  getFuelLog: async (id) => {
    const record = fuelLogs.find((f) => f.id === id && !f.deleted);
    if (!record) throw new Error("Fuel log not found or deleted");
    
    // Add efficiency calculations: distance travelled (mock) / quantity
    const distanceTravelled = 450; // Mock distance for calculations
    const distancePerLiter = record.quantity > 0 ? (distanceTravelled / record.quantity).toFixed(2) : "0.00";
    const fuelCostPerKilometer = distanceTravelled > 0 ? (record.totalCost / (distanceTravelled * 1.609)).toFixed(2) : "0.00";

    const efficiency = {
      distanceTravelled,
      fuelConsumed: record.quantity,
      distancePerLiter: `${distancePerLiter} mi/L`,
      fuelCostPerKilometer: `$${fuelCostPerKilometer}/km`
    };

    return mockResponse({ ...record, efficiency }, 200);
  },

  createFuelLog: async (data) => {
    const qty = Number(data.quantity || data.fuelQuantity || 0);
    const price = Number(data.costPerUnit || data.pricePerUnit || 0);
    const total = qty * price;

    const newLog = {
      ...data,
      id: `fuel-${Math.floor(1000 + Math.random() * 9000)}`,
      quantity: qty,
      costPerUnit: price,
      totalCost: total,
      date: data.date || data.fuelDate || new Date().toISOString().split("T")[0],
      deleted: false
    };

    fuelLogs.unshift(newLog);
    return mockResponse(newLog, 300);
  },

  updateFuelLog: async (id, data) => {
    let updated = null;
    const qty = Number(data.quantity || data.fuelQuantity || 0);
    const price = Number(data.costPerUnit || data.pricePerUnit || 0);
    const total = qty * price;

    fuelLogs = fuelLogs.map((f) => {
      if (f.id === id) {
        updated = {
          ...f,
          ...data,
          quantity: qty || f.quantity,
          costPerUnit: price || f.costPerUnit,
          totalCost: total || f.totalCost,
          date: data.date || data.fuelDate || f.date
        };
        return updated;
      }
      return f;
    });

    if (!updated) throw new Error("Log not found");
    return mockResponse(updated, 300);
  },

  deleteFuelLog: async (id) => {
    fuelLogs = fuelLogs.map((f) => (f.id === id ? { ...f, deleted: true } : f));
    return mockResponse({ success: true }, 200);
  },

  getVehicleFuelHistory: async (plateNumber) => {
    const history = MOCK_VEHICLE_FUEL_HISTORY[plateNumber] || [];
    return mockResponse(history, 250);
  },

  getFuelSummary: async () => {
    return mockResponse(MOCK_FUEL_SUMMARY, 200);
  },

  getFuelCharts: async () => {
    return mockResponse(MOCK_FUEL_CHARTS, 200);
  }
};

export default fuelService;
