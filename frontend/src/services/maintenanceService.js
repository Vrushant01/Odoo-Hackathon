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

// Helper to map backend maintenance record to frontend schema
export const mapMaintenanceToFrontend = (m) => {
  if (!m) return null;
  return {
    id: m._id,
    vehicle: m.vehicle ? `${m.vehicle.vehicleName} (${m.vehicle.registrationNumber})` : (m.vehicleId || "Unassigned Vehicle"),
    vehicleId: m.vehicle?._id || m.vehicleId || "",
    type: m.maintenanceType,
    category: m.category || "General",
    priority: m.priority || "Medium",
    scheduledDate: m.scheduledDate ? m.scheduledDate.split("T")[0] : "",
    startedDate: m.startedDate ? m.startedDate.split("T")[0] : "",
    completionDate: m.completedDate ? m.completedDate.split("T")[0] : "",
    cost: m.finalCost || m.estimatedCost || 0,
    mechanic: m.mechanic || "N/A",
    workshop: m.workshop || "N/A",
    status: m.status || "Scheduled",
    description: m.description || "",
    remarks: m.remarks || m.serviceNotes || "",
    attachments: m.attachments || []
  };
};

// Helper to map frontend maintenance record to backend schema
export const mapMaintenanceToBackend = async (data) => {
  const vehicleId = await resolveVehicle(data.vehicle);
  return {
    vehicle: vehicleId,
    maintenanceType: data.type,
    category: data.category,
    priority: data.priority,
    scheduledDate: data.scheduledDate,
    mechanic: data.mechanic,
    workshop: data.workshop,
    description: data.description,
    estimatedCost: Number(data.cost || 0),
    status: data.status
  };
};

export const maintenanceService = {
  getMaintenance: async (params = {}) => {
    const backendParams = {};
    if (params.page !== undefined) backendParams.page = params.page;
    if (params.limit !== undefined) backendParams.limit = params.limit;
    if (params.search) backendParams.search = params.search;

    if (params.sort) {
      const fieldMap = {
        type: "maintenanceType",
        scheduledDate: "scheduledDate",
        cost: "finalCost",
        status: "status"
      };
      const backendField = fieldMap[params.sort] || params.sort;
      backendParams.sort = params.sortOrder === "desc" ? `-${backendField}` : backendField;
    }

    if (params.status) backendParams.status = params.status;
    if (params.priority) backendParams.priority = params.priority;

    const res = await api.get("/maintenance", { params: backendParams });
    if (res.data && res.data.maintenance) {
      return {
        maintenance: res.data.maintenance.map(mapMaintenanceToFrontend),
        pagination: res.data.pagination
      };
    }

    const arrayData = Array.isArray(res.data) ? res.data : (res.data?.maintenance || []);
    return arrayData.map(mapMaintenanceToFrontend);
  },

  getMaintenanceById: async (id) => {
    const res = await api.get(`/maintenance/${id}`);
    const details = res.data;
    const mapped = mapMaintenanceToFrontend(details.maintenance);
    
    // Construct cost breakdown for detail view
    const costSummary = {
      estimatedCost: details.maintenance.estimatedCost || 0,
      labourCost: details.maintenance.labourCost || 0,
      partsCost: details.maintenance.partsCost || 0,
      additionalCharges: details.maintenance.additionalCost || 0,
      finalCost: details.maintenance.finalCost || 0
    };

    return { ...mapped, costSummary };
  },

  createMaintenance: async (data) => {
    const payload = await mapMaintenanceToBackend(data);
    const res = await api.post("/maintenance", payload);
    return mapMaintenanceToFrontend(res.data);
  },

  updateMaintenance: async (id, data) => {
    let payload;
    if (data instanceof FormData) {
      payload = data;
    } else {
      payload = await mapMaintenanceToBackend(data);
    }
    const res = await api.put(`/maintenance/${id}`, payload);
    return mapMaintenanceToFrontend(res.data);
  },

  deleteMaintenance: async (id) => {
    return await api.delete(`/maintenance/${id}`);
  },

  startMaintenance: async (id) => {
    const res = await api.patch(`/maintenance/${id}/start`);
    return mapMaintenanceToFrontend(res.data);
  },

  completeMaintenance: async (id, details) => {
    const partsUsed = typeof details.partsUsed === "string" 
      ? details.partsUsed.split(",").map(p => p.trim()).filter(Boolean) 
      : (details.partsUsed || []);

    const res = await api.patch(`/maintenance/${id}/complete`, {
      labourCost: 0,
      partsCost: Number(details.finalCost || 0),
      additionalCost: 0,
      partsUsed,
      serviceNotes: details.notes || ""
    });
    return mapMaintenanceToFrontend(res.data);
  },

  cancelMaintenance: async (id, details) => {
    const res = await api.patch(`/maintenance/${id}/cancel`, {
      reason: details?.reason || "Cancelled by Fleet Manager"
    });
    return mapMaintenanceToFrontend(res.data);
  },

  getVehicleMaintenance: async (plateNumber) => {
    const vehRes = await api.get(`/vehicles?search=${encodeURIComponent(plateNumber)}`);
    const vehicle = vehRes.data?.vehicles?.[0] || vehRes.data?.[0];
    if (!vehicle) return [];
    
    const res = await api.get(`/maintenance?vehicleId=${vehicle._id}`);
    const arrayData = res.data?.maintenance || res.data || [];
    return arrayData.map(mapMaintenanceToFrontend);
  },

  getUpcomingMaintenance: async () => {
    const res = await api.get("/maintenance/upcoming");
    const arrayData = res.data || [];
    return arrayData.map(mapMaintenanceToFrontend);
  },

  getOverdueMaintenance: async () => {
    const res = await api.get("/maintenance/overdue");
    const arrayData = res.data || [];
    return arrayData.map(mapMaintenanceToFrontend);
  },

  getMaintenanceTimeline: async (id) => {
    // Timeline logs can be constructed from general details or stubbed
    return [];
  }
};

export default maintenanceService;
