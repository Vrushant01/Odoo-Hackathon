import { MOCK_DRIVERS } from "../mock-data/drivers";
import { MOCK_DRIVER_TIMELINE } from "../mock-data/driverTimeline";
import { MOCK_DRIVER_TRIPS } from "../mock-data/driverTrips";
import { MOCK_DRIVER_PERFORMANCE } from "../mock-data/driverPerformance";
import { MOCK_DRIVER_DOCUMENTS } from "../mock-data/driverDocuments";
import { mockResponse } from "./apiHelper";

// Session mutable driver array
let drivers = [...MOCK_DRIVERS];

export const driverService = {
  getDrivers: async () => {
    // Exclude soft-deleted drivers
    const activeDrivers = drivers.filter((d) => !d.deleted);
    return mockResponse(activeDrivers, 350);
  },

  getDriver: async (id) => {
    const driver = drivers.find((d) => d.id === id && !d.deleted);
    if (!driver) throw new Error("Driver profile not found or deleted");
    
    // Find documents or fallback
    const documents = MOCK_DRIVER_DOCUMENTS[id] || { drivingLicense: null, govId: null, medicalCert: null, policeVerification: null };
    
    return mockResponse({ ...driver, documents }, 200);
  },

  createDriver: async (data) => {
    // Unique check
    const duplicate = drivers.find(
      (d) => d.licenseNumber.toLowerCase() === data.licenseNumber.toLowerCase() && !d.deleted
    );
    if (duplicate) {
      throw new Error(`A driver with license number ${data.licenseNumber} already exists.`);
    }

    const newDriver = {
      ...data,
      id: `drv-${Date.now()}`,
      avatar: data.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120",
      experience: data.experience ? Number(data.experience) : 0,
      safetyScore: 100, // Starts fresh with perfect score
      status: data.status || "Available",
      deleted: false
    };

    drivers.unshift(newDriver);
    return mockResponse(newDriver, 300);
  },

  updateDriver: async (id, data) => {
    let updatedDriver = null;
    drivers = drivers.map((d) => {
      if (d.id === id) {
        updatedDriver = { ...d, ...data };
        return updatedDriver;
      }
      return d;
    });

    if (!updatedDriver) throw new Error("Driver not found");
    return mockResponse(updatedDriver, 300);
  },

  deleteDriver: async (id) => {
    // Soft delete
    drivers = drivers.map((d) => (d.id === id ? { ...d, deleted: true } : d));
    return mockResponse({ success: true }, 200);
  },

  activateDriver: async (id) => {
    let activatedDriver = null;
    drivers = drivers.map((d) => {
      if (d.id === id) {
        activatedDriver = { ...d, status: "Available", suspensionDetails: null };
        return activatedDriver;
      }
      return d;
    });

    if (!activatedDriver) throw new Error("Driver not found");
    return mockResponse(activatedDriver, 250);
  },

  suspendDriver: async (id, details) => {
    let suspendedDriver = null;
    drivers = drivers.map((d) => {
      if (d.id === id) {
        suspendedDriver = {
          ...d,
          status: "Suspended",
          assignedVehicle: null,
          currentTrip: null,
          suspensionDetails: {
            reason: details.reason,
            suspensionDate: details.suspensionDate || new Date().toISOString().split("T")[0],
            expectedReturn: details.expectedReturn,
            notes: details.notes
          }
        };
        return suspendedDriver;
      }
      return d;
    });

    if (!suspendedDriver) throw new Error("Driver not found");
    return mockResponse(suspendedDriver, 300);
  },

  getDriverTrips: async (id) => {
    const trips = MOCK_DRIVER_TRIPS[id] || [];
    return mockResponse(trips, 250);
  },

  getDriverPerformance: async (id) => {
    const perf = MOCK_DRIVER_PERFORMANCE[id] || {
      safetyScore: 100,
      violations: 0,
      accidents: 0,
      warnings: 0,
      safeTrips: 0,
      completedTrips: 0,
      cancelledTrips: 0,
      averageDistance: "0 mi",
      fuelEfficiency: "0.0 mpg",
      onTimeRate: 100,
      averageRating: 5.0
    };
    return mockResponse(perf, 200);
  },

  getDriverTimeline: async (id) => {
    const timeline = MOCK_DRIVER_TIMELINE[id] || [];
    return mockResponse(timeline, 200);
  }
};

export default driverService;
