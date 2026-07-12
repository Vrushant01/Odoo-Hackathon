import { MOCK_VEHICLES } from "../mock-data/vehicles";
import { MOCK_VEHICLE_HISTORY } from "../mock-data/vehicleHistory";
import { MOCK_VEHICLE_TRIPS } from "../mock-data/vehicleTrips";
import { MOCK_VEHICLE_MAINTENANCE } from "../mock-data/vehicleMaintenance";
import { MOCK_VEHICLE_FUEL_LOGS } from "../mock-data/vehicleFuelLogs";
import { MOCK_VEHICLE_DOCUMENTS } from "../mock-data/vehicleDocuments";
import { mockResponse } from "./apiHelper";

// Session-mutable in-memory registry
let vehicles = [...MOCK_VEHICLES];

export const vehicleService = {
  getVehicles: async () => {
    // Exclude soft-deleted assets
    const activeVehicles = vehicles.filter((v) => !v.deleted);
    return mockResponse(activeVehicles, 350);
  },

  getVehicle: async (id) => {
    const vehicle = vehicles.find((v) => v.id === id && !v.deleted);
    if (!vehicle) throw new Error("Vehicle not found or deleted");
    
    // Find documents or fallback
    const documents = MOCK_VEHICLE_DOCUMENTS[id] || { rcBook: null, insurance: null, pollution: null, fitness: null, image: null };
    
    return mockResponse({ ...vehicle, documents }, 200);
  },

  createVehicle: async (data) => {
    // Unique check
    const duplicate = vehicles.find(
      (v) => v.plateNumber.toLowerCase() === data.plateNumber.toLowerCase() && !v.deleted
    );
    if (duplicate) {
      throw new Error(`A vehicle with registration plate ${data.plateNumber} already exists.`);
    }

    const newVehicle = {
      ...data,
      id: `veh-${Date.now()}`,
      odometer: data.odometer ? Number(data.odometer) : 0,
      loadCapacity: data.loadCapacity ? Number(data.loadCapacity) : 0,
      cost: data.cost ? Number(data.cost) : 0,
      status: data.status || "Available",
      deleted: false
    };

    vehicles.unshift(newVehicle);
    return mockResponse(newVehicle, 300);
  },

  updateVehicle: async (id, data) => {
    let updatedVehicle = null;
    vehicles = vehicles.map((v) => {
      if (v.id === id) {
        if (v.status === "Retired") {
          throw new Error("Cannot edit retired vehicles.");
        }
        updatedVehicle = { ...v, ...data };
        return updatedVehicle;
      }
      return v;
    });

    if (!updatedVehicle) throw new Error("Vehicle not found");
    return mockResponse(updatedVehicle, 300);
  },

  deleteVehicle: async (id) => {
    // Soft delete only
    vehicles = vehicles.map((v) => (v.id === id ? { ...v, deleted: true } : v));
    return mockResponse({ success: true }, 200);
  },

  retireVehicle: async (id) => {
    let retiredVehicle = null;
    vehicles = vehicles.map((v) => {
      if (v.id === id) {
        retiredVehicle = { ...v, status: "Retired", currentDriver: null, currentTrip: null };
        return retiredVehicle;
      }
      return v;
    });

    if (!retiredVehicle) throw new Error("Vehicle not found");
    return mockResponse(retiredVehicle, 250);
  },

  getVehicleHistory: async (id) => {
    const history = MOCK_VEHICLE_HISTORY[id] || {
      totalTrips: 0,
      completedTrips: 0,
      cancelledTrips: 0,
      maintenanceCount: 0,
      fuelLogsCount: 0,
      expenses: 0,
      revenue: 0,
      roi: 0
    };
    return mockResponse(history, 200);
  },

  getVehicleTrips: async (id) => {
    const trips = MOCK_VEHICLE_TRIPS[id] || [];
    return mockResponse(trips, 250);
  },

  getVehicleMaintenance: async (id) => {
    const maintenance = MOCK_VEHICLE_MAINTENANCE[id] || [];
    return mockResponse(maintenance, 250);
  },

  getVehicleFuelLogs: async (id) => {
    const fuelLogs = MOCK_VEHICLE_FUEL_LOGS[id] || [];
    return mockResponse(fuelLogs, 200);
  }
};

export default vehicleService;
