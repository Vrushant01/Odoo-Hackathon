import api from "./api";

// Helper to map backend vehicle to frontend schema
export const mapVehicleToFrontend = (v) => {
  if (!v) return null;
  const typeMap = {
    "Truck": "Heavy Truck",
    "Van": "Cargo Van",
    "Trailer": "Flatbed Trailer"
  };

  const docs = {
    rcBook: v.registrationCertificate ? { name: "Registration Book", size: "1.2 MB", issueDate: v.purchaseDate ? v.purchaseDate.split("T")[0] : "N/A" } : null,
    insurance: v.insuranceNumber ? { name: "Insurance Policy", size: "850 KB", issueDate: "N/A" } : null,
    pollution: v.pollutionCertificate ? { name: "Pollution Cert", size: "450 KB", issueDate: "N/A" } : null,
    fitness: v.fitnessCertificate ? { name: "Fitness Cert", size: "900 KB", issueDate: "N/A" } : null,
    image: v.registrationCertificate || "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=200"
  };

  return {
    id: v._id,
    plateNumber: v.registrationNumber,
    name: v.vehicleName,
    model: v.vehicleModel,
    type: typeMap[v.vehicleType] || v.vehicleType || "Heavy Truck",
    manufacturer: v.manufacturer || "",
    year: v.purchaseDate ? new Date(v.purchaseDate).getFullYear() : new Date().getFullYear(),
    fuelType: v.fuelType === "Petrol" ? "Gasoline" : (v.fuelType || "Diesel"),
    capacity: "2 Persons",
    loadCapacity: v.maximumLoadCapacity || 0,
    odometer: v.currentOdometer || 0,
    cost: v.acquisitionCost || 0,
    purchaseDate: v.purchaseDate ? v.purchaseDate.split("T")[0] : "",
    insuranceNumber: v.insuranceNumber || "",
    insuranceExpiry: v.insuranceExpiry ? v.insuranceExpiry.split("T")[0] : "",
    rcNumber: v.insuranceNumber || "RC-TX-88271A",
    region: v.region || "South",
    status: v.status || "Available",
    notes: v.notes || "",
    documents: docs
  };
};

// Helper to map frontend data to backend schema
export const mapVehicleToBackend = (data) => {
  const typeMap = {
    "Heavy Truck": "Truck",
    "Cargo Van": "Van",
    "Delivery Van": "Van",
    "Flatbed Trailer": "Trailer"
  };
  return {
    registrationNumber: data.plateNumber,
    vehicleName: data.name,
    vehicleModel: data.model,
    vehicleType: typeMap[data.type] || data.type || "Truck",
    manufacturer: data.manufacturer,
    fuelType: data.fuelType === "Gasoline" ? "Petrol" : data.fuelType,
    maximumLoadCapacity: Number(data.loadCapacity || 0),
    currentOdometer: Number(data.odometer || 0),
    acquisitionCost: Number(data.cost || 0),
    purchaseDate: data.purchaseDate,
    insuranceNumber: data.insuranceNumber,
    insuranceExpiry: data.insuranceExpiry,
    region: data.region,
    status: data.status,
    notes: data.notes
  };
};

export const vehicleService = {
  getVehicles: async (params = {}) => {
    const backendParams = {};
    if (params.page !== undefined) backendParams.page = params.page;
    if (params.limit !== undefined) backendParams.limit = params.limit;
    if (params.search) backendParams.search = params.search;
    
    if (params.sort) {
      const fieldMap = {
        plateNumber: "registrationNumber",
        name: "vehicleName",
        model: "vehicleModel",
        odometer: "currentOdometer",
        loadCapacity: "maximumLoadCapacity",
        cost: "acquisitionCost"
      };
      const backendField = fieldMap[params.sort] || params.sort;
      backendParams.sort = params.sortOrder === "desc" ? `-${backendField}` : backendField;
    }

    if (params.type) {
      const typeMap = {
        "Heavy Truck": "Truck",
        "Cargo Van": "Van",
        "Delivery Van": "Van",
        "Flatbed Trailer": "Trailer"
      };
      backendParams.vehicleType = typeMap[params.type] || params.type;
    }
    if (params.status) backendParams.status = params.status;
    if (params.region) backendParams.region = params.region;

    const res = await api.get("/vehicles", { params: backendParams });
    // Returns array for backward compatibility with components or structured object if pagination is needed
    if (res.data && res.data.vehicles) {
      if (params.page !== undefined || params.limit !== undefined) {
        return {
          vehicles: res.data.vehicles.map(mapVehicleToFrontend),
          pagination: res.data.pagination
        };
      }
      return res.data.vehicles.map(mapVehicleToFrontend);
    }
    
    // Fallback if returned structure changes
    const arrayData = Array.isArray(res.data) ? res.data : (res.data?.vehicles || []);
    return arrayData.map(mapVehicleToFrontend);
  },

  getVehicle: async (id) => {
    const res = await api.get(`/vehicles/${id}`);
    const details = res.data;
    // Map details.vehicle
    const mapped = mapVehicleToFrontend(details.vehicle);
    return mapped;
  },

  createVehicle: async (data) => {
    const backendData = mapVehicleToBackend(data);
    const res = await api.post("/vehicles", backendData);
    return mapVehicleToFrontend(res.data);
  },

  updateVehicle: async (id, data) => {
    let payload;
    let headers = {};

    if (data instanceof FormData) {
      payload = data;
    } else {
      payload = mapVehicleToBackend(data);
    }

    const res = await api.put(`/vehicles/${id}`, payload, { headers });
    return mapVehicleToFrontend(res.data);
  },

  deleteVehicle: async (id) => {
    return await api.delete(`/vehicles/${id}`);
  },

  retireVehicle: async (id) => {
    const res = await api.patch(`/vehicles/${id}/retire`);
    return mapVehicleToFrontend(res.data);
  },

  getVehicleHistory: async (id) => {
    const res = await api.get(`/vehicles/${id}`);
    const { summaries } = res.data;
    return {
      totalTrips: summaries.trips.total,
      completedTrips: summaries.trips.completed,
      cancelledTrips: summaries.trips.total - summaries.trips.completed,
      maintenanceCount: summaries.maintenance.totalCost ? 1 : 0, // placeholder count
      fuelLogsCount: summaries.fuel.totalLiters ? 1 : 0,
      expenses: summaries.expense.totalAmount,
      revenue: summaries.roi.estimatedRevenue,
      roi: summaries.roi.roiPercentage
    };
  },

  getVehicleTrips: async (id) => {
    const res = await api.get(`/vehicles/${id}/history`);
    return (res.data.trips || []).map((t) => ({
      id: t._id,
      driver: t.driver?.fullName || "Driver",
      origin: t.source,
      destination: t.destination,
      distance: t.actualDistance || t.plannedDistance,
      status: t.status,
      startDate: t.dispatchDate ? t.dispatchDate.split("T")[0] : "N/A"
    }));
  },

  getVehicleMaintenance: async (id) => {
    const res = await api.get(`/vehicles/${id}/history`);
    return (res.data.maintenance || []).map((m) => ({
      id: m._id,
      type: m.maintenanceType,
      description: m.description,
      cost: m.finalCost || m.estimatedCost,
      scheduledDate: m.scheduledDate ? m.scheduledDate.split("T")[0] : "N/A",
      mechanic: m.mechanic || "N/A",
      status: m.status
    }));
  },

  getVehicleFuelLogs: async (id) => {
    const res = await api.get(`/vehicles/${id}/history`);
    return (res.data.fuelLogs || []).map((f) => ({
      date: f.fuelDate ? f.fuelDate.split("T")[0] : "N/A",
      liters: f.quantity,
      cost: f.totalCost,
      location: f.fuelStation,
      odometer: f.currentOdometer
    }));
  }
};

export default vehicleService;
