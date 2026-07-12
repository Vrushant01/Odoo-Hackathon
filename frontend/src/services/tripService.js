import { MOCK_TRIPS } from "../mock-data/trips";
import { MOCK_TRIP_TIMELINE } from "../mock-data/tripTimeline";
import { MOCK_TRIP_FUEL } from "../mock-data/tripFuel";
import { MOCK_TRIP_EXPENSES } from "../mock-data/tripExpenses";
import { MOCK_TRIP_STATISTICS } from "../mock-data/tripStatistics";
import { mockResponse } from "./apiHelper";

// Session mutable trip array
let trips = [...MOCK_TRIPS];

export const tripService = {
  getTrips: async () => {
    // Exclude soft-deleted trips
    const activeTrips = trips.filter((t) => !t.deleted);
    return mockResponse(activeTrips, 350);
  },

  getTrip: async (id) => {
    const trip = trips.find((t) => t.id === id && !t.deleted);
    if (!trip) throw new Error("Trip record not found or deleted");
    
    // Find stats or fallback
    const stats = MOCK_TRIP_STATISTICS[id] || { distance: 0, cargoDelivered: 0, averageSpeed: "0 mph", duration: "0 hrs", completionRate: 0 };
    
    return mockResponse({ ...trip, stats }, 200);
  },

  createTrip: async (data) => {
    const newTrip = {
      ...data,
      id: `TR-${Math.floor(1000 + Math.random() * 9000)}`, // Generate random 4-digit code
      cargoWeight: data.cargoWeight ? Number(data.cargoWeight) : 0,
      plannedDistance: data.plannedDistance ? Number(data.plannedDistance) : 0,
      expectedDuration: data.expectedDuration ? Number(data.expectedDuration) : 0,
      status: "Draft",
      createdDate: new Date().toISOString().split("T")[0],
      deleted: false
    };

    trips.unshift(newTrip);
    return mockResponse(newTrip, 300);
  },

  updateTrip: async (id, data) => {
    let updatedTrip = null;
    trips = trips.map((t) => {
      if (t.id === id) {
        if (t.status === "Completed" || t.status === "Cancelled") {
          throw new Error("Cannot edit completed or cancelled trips.");
        }
        updatedTrip = { ...t, ...data };
        return updatedTrip;
      }
      return t;
    });

    if (!updatedTrip) throw new Error("Trip not found");
    return mockResponse(updatedTrip, 300);
  },

  dispatchTrip: async (id, details) => {
    let dispatched = null;
    trips = trips.map((t) => {
      if (t.id === id) {
        dispatched = {
          ...t,
          status: "Dispatched",
          dispatchDate: details.dispatchDate || new Date().toISOString().split("T")[0],
          notes: details.notes || t.notes
        };
        return dispatched;
      }
      return t;
    });

    if (!dispatched) throw new Error("Trip not found");
    return mockResponse(dispatched, 250);
  },

  completeTrip: async (id, details) => {
    let completed = null;
    trips = trips.map((t) => {
      if (t.id === id) {
        completed = {
          ...t,
          status: "Completed",
          completionDate: details.completionDate || new Date().toISOString().split("T")[0],
          notes: `${t.notes || ""}\nCompletion Notes: ${details.notes || ""}\nDelay Reason: ${details.delayReason || "None"}`,
          actualDistance: details.actualDistance ? Number(details.actualDistance) : t.plannedDistance,
          finalOdometer: Number(details.finalOdometer)
        };
        return completed;
      }
      return t;
    });

    if (!completed) throw new Error("Trip not found");
    return mockResponse(completed, 300);
  },

  cancelTrip: async (id, details) => {
    let cancelled = null;
    trips = trips.map((t) => {
      if (t.id === id) {
        cancelled = {
          ...t,
          status: "Cancelled",
          cancelReason: details.reason,
          cancelNotes: details.notes
        };
        return cancelled;
      }
      return t;
    });

    if (!cancelled) throw new Error("Trip not found");
    return mockResponse(cancelled, 250);
  },

  deleteTrip: async (id) => {
    trips = trips.map((t) => (t.id === id ? { ...t, deleted: true } : t));
    return mockResponse({ success: true }, 200);
  },

  getTripTimeline: async (id) => {
    const timeline = MOCK_TRIP_TIMELINE[id] || [];
    return mockResponse(timeline, 200);
  },

  getTripExpenses: async (id) => {
    const expenses = MOCK_TRIP_EXPENSES[id] || { fuel: 0, maintenance: 0, tolls: 0, other: 0, totalCost: 0 };
    return mockResponse(expenses, 200);
  },

  getTripFuel: async (id) => {
    const fuel = MOCK_TRIP_FUEL[id] || { fuelConsumed: 0, fuelCost: 0, fuelEfficiency: "N/A" };
    return mockResponse(fuel, 200);
  }
};

export default tripService;
