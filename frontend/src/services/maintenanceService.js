import { MOCK_MAINTENANCE } from "../mock-data/maintenance";
import { MOCK_MAINTENANCE_HISTORY } from "../mock-data/maintenanceHistory";
import { MOCK_MAINTENANCE_TIMELINE } from "../mock-data/maintenanceTimeline";
import { MOCK_MAINTENANCE_COST } from "../mock-data/maintenanceCost";
import { MOCK_UPCOMING_MAINTENANCE } from "../mock-data/upcomingMaintenance";
import { MOCK_OVERDUE_MAINTENANCE } from "../mock-data/overdueMaintenance";
import { mockResponse } from "./apiHelper";

// Session mutable maintenance records
let maintenanceRecords = [...MOCK_MAINTENANCE];

export const maintenanceService = {
  getMaintenance: async () => {
    const active = maintenanceRecords.filter((m) => !m.deleted);
    return mockResponse(active, 350);
  },

  getMaintenanceById: async (id) => {
    const record = maintenanceRecords.find((m) => m.id === id && !m.deleted);
    if (!record) throw new Error("Maintenance record not found or deleted");
    
    const costSummary = MOCK_MAINTENANCE_COST[id] || { estimatedCost: 0, labourCost: 0, partsCost: 0, additionalCharges: 0, finalCost: 0 };
    return mockResponse({ ...record, costSummary }, 200);
  },

  createMaintenance: async (data) => {
    const newRecord = {
      ...data,
      id: `maint-${Math.floor(1000 + Math.random() * 9000)}`,
      cost: data.cost ? Number(data.cost) : 0,
      status: "Scheduled",
      deleted: false
    };

    maintenanceRecords.unshift(newRecord);
    return mockResponse(newRecord, 300);
  },

  updateMaintenance: async (id, data) => {
    let updated = null;
    maintenanceRecords = maintenanceRecords.map((m) => {
      if (m.id === id) {
        if (m.status === "Completed" || m.status === "Cancelled") {
          throw new Error("Cannot edit completed or cancelled records.");
        }
        updated = { ...m, ...data };
        return updated;
      }
      return m;
    });

    if (!updated) throw new Error("Record not found");
    return mockResponse(updated, 300);
  },

  deleteMaintenance: async (id) => {
    maintenanceRecords = maintenanceRecords.map((m) => (m.id === id ? { ...m, deleted: true } : m));
    return mockResponse({ success: true }, 200);
  },

  startMaintenance: async (id) => {
    let started = null;
    maintenanceRecords = maintenanceRecords.map((m) => {
      if (m.id === id) {
        started = { ...m, status: "In Progress" };
        return started;
      }
      return m;
    });

    if (!started) throw new Error("Record not found");
    return mockResponse(started, 250);
  },

  completeMaintenance: async (id, details) => {
    let completed = null;
    maintenanceRecords = maintenanceRecords.map((m) => {
      if (m.id === id) {
        completed = {
          ...m,
          status: "Completed",
          completionDate: details.completionDate || new Date().toISOString().split("T")[0],
          cost: Number(details.finalCost) || m.cost,
          remarks: `${m.remarks || ""}\nParts Used: ${details.partsUsed || "None"}\nService Notes: ${details.notes || ""}`,
          finalOdometer: Number(details.finalOdometer)
        };
        return completed;
      }
      return m;
    });

    if (!completed) throw new Error("Record not found");
    return mockResponse(completed, 300);
  },

  cancelMaintenance: async (id, details) => {
    let cancelled = null;
    maintenanceRecords = maintenanceRecords.map((m) => {
      if (m.id === id) {
        cancelled = {
          ...m,
          status: "Cancelled",
          cancelReason: details.reason,
          remarks: `${m.remarks || ""}\nCancellation Notes: ${details.notes || ""}`
        };
        return cancelled;
      }
      return m;
    });

    if (!cancelled) throw new Error("Record not found");
    return mockResponse(cancelled, 250);
  },

  getVehicleMaintenance: async (plateNumber) => {
    const history = MOCK_MAINTENANCE_HISTORY[plateNumber] || [];
    return mockResponse(history, 200);
  },

  getUpcomingMaintenance: async () => {
    return mockResponse(MOCK_UPCOMING_MAINTENANCE, 200);
  },

  getOverdueMaintenance: async () => {
    return mockResponse(MOCK_OVERDUE_MAINTENANCE, 200);
  },

  getMaintenanceTimeline: async (id) => {
    const timeline = MOCK_MAINTENANCE_TIMELINE[id] || [];
    return mockResponse(timeline, 200);
  }
};

export default maintenanceService;
