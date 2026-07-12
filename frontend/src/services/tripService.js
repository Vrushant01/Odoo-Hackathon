import api from "./api";

// Helper to map backend trip to frontend trip schema
export const mapTripToFrontend = (t) => {
  if (!t) return null;
  
  const getVehicleString = () => {
    if (t.vehicle && typeof t.vehicle === "object") {
      return `${t.vehicle.vehicleName} (${t.vehicle.registrationNumber})`;
    }
    return t.vehicle || "Unassigned Vehicle";
  };

  const getDriverString = () => {
    if (t.driver && typeof t.driver === "object") {
      return t.driver.fullName;
    }
    return t.driver || "Unassigned Driver";
  };

  return {
    id: t._id,
    tripNumber: t.tripNumber,
    vehicle: getVehicleString(),
    vehicleId: t.vehicle?._id || t.vehicle || "",
    driver: getDriverString(),
    driverId: t.driver?._id || t.driver || "",
    source: t.source,
    destination: t.destination,
    cargoDescription: t.cargoDescription,
    cargoWeight: t.cargoWeight || 0,
    vehicleCapacity: t.vehicle?.maximumLoadCapacity || 0,
    plannedDistance: t.plannedDistance || 0,
    expectedDuration: t.actualDuration || 5, // fallback
    notes: t.notes || "",
    priority: t.priority || "Medium",
    dispatchDate: t.dispatchDate ? t.dispatchDate.split("T")[0] : "",
    expectedCompletion: t.completedDate ? t.completedDate.split("T")[0] : "",
    status: t.status || "Draft",
    createdDate: t.createdAt ? t.createdAt.split("T")[0] : "",
    cancelReason: t.cancelReason || "",
    cancelNotes: t.remarks || ""
  };
};

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
    ...data,
    vehicle: vehicleId,
    driver: driverId,
    dispatchDate: data.dispatchDate || new Date().toISOString()
  };
};

export const tripService = {
  getTrips: async (params = {}) => {
    const backendParams = {};
    if (params.page !== undefined) backendParams.page = params.page;
    if (params.limit !== undefined) backendParams.limit = params.limit;
    if (params.search) backendParams.search = params.search;

    if (params.sort) {
      const fieldMap = {
        tripNumber: "tripNumber",
        source: "source",
        destination: "destination",
        priority: "priority",
        status: "status"
      };
      const backendField = fieldMap[params.sort] || params.sort;
      backendParams.sort = params.sortOrder === "desc" ? `-${backendField}` : backendField;
    }

    if (params.status) backendParams.status = params.status;
    if (params.priority) backendParams.priority = params.priority;

    const res = await api.get("/trips", { params: backendParams });
    if (res.data && res.data.trips) {
      if (params.page !== undefined || params.limit !== undefined) {
        return {
          trips: res.data.trips.map(mapTripToFrontend),
          pagination: res.data.pagination
        };
      }
      return res.data.trips.map(mapTripToFrontend);
    }

    const arrayData = Array.isArray(res.data) ? res.data : (res.data?.trips || []);
    return arrayData.map(mapTripToFrontend);
  },

  getTrip: async (id) => {
    const res = await api.get(`/trips/${id}`);
    const details = res.data;
    const mapped = mapTripToFrontend(details.trip);
    
    // Add stats payload for frontend spec page
    const distance = details.trip.actualDistance || details.trip.plannedDistance || 0;
    const stats = {
      distance,
      cargoDelivered: details.trip.status === "Completed" ? details.trip.cargoWeight : 0,
      averageSpeed: "55 mph",
      duration: `${details.trip.actualDuration || 5} hrs`,
      completionRate: details.trip.status === "Completed" ? 100 : 0
    };

    return { ...mapped, stats };
  },

  createTrip: async (data) => {
    const payload = await resolveAssets(data);
    const res = await api.post("/trips", payload);
    return mapTripToFrontend(res.data);
  },

  updateTrip: async (id, data) => {
    const payload = await resolveAssets(data);
    const res = await api.put(`/trips/${id}`, payload);
    return mapTripToFrontend(res.data);
  },

  dispatchTrip: async (id, details) => {
    const res = await api.patch(`/trips/${id}/dispatch`, {
      dispatchDate: details.dispatchDate || new Date().toISOString(),
      notes: details.notes
    });
    return mapTripToFrontend(res.data);
  },

  completeTrip: async (id, details) => {
    const res = await api.patch(`/trips/${id}/complete`, {
      finalOdometer: Number(details.finalOdometer),
      fuelConsumed: Number(details.fuelConsumed),
      actualDistance: Number(details.actualDistance),
      completionDate: details.completionDate || new Date().toISOString(),
      fuelCost: Number(details.fuelCost || 0),
      tollCost: Number(details.tollCost || 0),
      otherExpenses: Number(details.otherExpenses || 0),
      notes: details.notes
    });
    return mapTripToFrontend(res.data);
  },

  cancelTrip: async (id, details) => {
    const res = await api.patch(`/trips/${id}/cancel`, {
      reason: details.reason,
      notes: details.notes
    });
    return mapTripToFrontend(res.data);
  },

  deleteTrip: async (id) => {
    return await api.delete(`/trips/${id}`);
  },

  getTripTimeline: async (id) => {
    const res = await api.get(`/trips/${id}/timeline`);
    return (res.data || []).map((log) => ({
      id: log._id,
      event: log.eventType,
      description: log.description,
      date: log.createdAt ? log.createdAt.split("T")[0] : "N/A",
      user: log.createdBy?.fullName || "System"
    }));
  },

  getTripExpenses: async (id) => {
    const res = await api.get(`/trips/${id}`);
    const trip = res.data.trip;
    // Calculate expense from completed metrics
    return {
      fuel: trip.fuelCost || 0,
      maintenance: trip.maintenanceCost || 0,
      tolls: trip.tollCost || 0,
      other: trip.otherExpenses || 0,
      totalCost: (trip.fuelCost || 0) + (trip.maintenanceCost || 0) + (trip.tollCost || 0) + (trip.otherExpenses || 0)
    };
  },

  getTripFuel: async (id) => {
    const res = await api.get(`/trips/${id}`);
    const trip = res.data.trip;
    const distance = trip.actualDistance || trip.plannedDistance || 0;
    const efficiency = trip.fuelConsumed > 0 ? (distance / trip.fuelConsumed).toFixed(1) : "0.0";
    return {
      fuelConsumed: trip.fuelConsumed || 0,
      fuelCost: trip.fuelCost || 0,
      fuelEfficiency: `${efficiency} mpg`
    };
  }
};

export default tripService;
