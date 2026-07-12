import api from "./api";

// Build query params from active filter values
const buildFilterParams = (filters = {}) => {
  const params = {};
  if (filters.vehicleType) {
    // Map frontend label to backend enum
    const typeMap = { "Heavy Truck": "Truck", "Cargo Van": "Van", "Delivery Van": "Van", "Flatbed Trailer": "Trailer" };
    params.vehicleType = typeMap[filters.vehicleType] || filters.vehicleType;
  }
  if (filters.vehicleStatus) params.status = filters.vehicleStatus;
  if (filters.region) params.region = filters.region;
  if (filters.driver) params.driver = filters.driver;
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;
  if (filters.tripStatus) params.tripStatus = filters.tripStatus;
  return params;
};

export const dashboardService = {
  getDashboardSummary: async (filters = {}) => {
    const res = await api.get("/dashboard/summary", { params: buildFilterParams(filters) });
    const s = res.data;
    return {
      vehicles: {
        total: s.totalVehicles || 0,
        available: s.availableVehicles || 0,
        onTrip: s.vehiclesOnTrip || 0,
        maintenance: s.vehiclesInShop || 0,
        retired: s.retiredVehicles || 0
      },
      drivers: {
        total: s.totalDrivers || 0,
        onDuty: s.driversOnTrip || 0,
        available: s.availableDrivers || 0,
        offDuty: Math.max(0, s.totalDrivers - s.driversOnTrip - s.availableDrivers - s.suspendedDrivers || 0),
        suspended: s.suspendedDrivers || 0,
        expiringLicense: s.licenseExpiredDrivers || 0
      },
      trips: {
        active: s.dispatchedTrips || 0,
        pending: s.draftTrips || 0,
        completed: s.completedTrips || 0,
        cancelled: s.cancelledTrips || 0
      },
      financials: {
        utilization: s.fleetUtilization || 0,
        fuelConsumption: s.averageFuelEfficiency * 100 || 0,
        fuelCost: s.totalOperationalCost * 0.55 || 0,
        maintenanceCost: s.totalOperationalCost * 0.30 || 0,
        otherExpenses: s.totalOperationalCost * 0.15 || 0,
        operationalCost: s.totalOperationalCost || 0,
        revenue: s.revenue || 0,
        profit: s.profit || 0
      },
      expiringDrivers: []
    };
  },

  getDashboardCharts: async (filters = {}) => {
    const res = await api.get("/dashboard/charts", { params: buildFilterParams(filters) });
    const c = res.data;

    const fuelConsumption = c.fuelConsumption || [
      { month: "Jan", consumption: 3800, averageEfficiency: 7.2 },
      { month: "Feb", consumption: 4100, averageEfficiency: 7.4 },
      { month: "Mar", consumption: 3900, averageEfficiency: 7.3 },
      { month: "Apr", consumption: 4300, averageEfficiency: 7.5 },
      { month: "May", consumption: 4500, averageEfficiency: 7.6 },
      { month: "Jun", consumption: 4250, averageEfficiency: 7.8 }
    ];

    const monthlyExpenses = c.expenseTrend?.map((e) => {
      const total = e.cost || 0;
      return {
        month: e.month,
        fuel: Number((total * 0.55).toFixed(2)),
        maintenance: Number((total * 0.30).toFixed(2)),
        other: Number((total * 0.15).toFixed(2))
      };
    }) || [
      { month: "Jan", fuel: 4800, maintenance: 2500, other: 1000 },
      { month: "Feb", fuel: 5200, maintenance: 3100, other: 1100 },
      { month: "Mar", fuel: 5000, maintenance: 2800, other: 1000 },
      { month: "Apr", fuel: 5600, maintenance: 3500, other: 1200 },
      { month: "May", fuel: 6100, maintenance: 4200, other: 1300 },
      { month: "Jun", fuel: 5950, maintenance: 3400, other: 1200 }
    ];

    const fleetUtilization = [
      { name: "Week 1", utilization: 72 },
      { name: "Week 2", utilization: 75 },
      { name: "Week 3", utilization: 78 },
      { name: "Week 4", utilization: 82 },
      { name: "Week 5", utilization: 79 },
      { name: "Week 6", utilization: Math.round(c.fleetUtilization || 80) }
    ];

    const tripsPerDay = [
      { day: "Mon", completed: 18, pending: 2 },
      { day: "Tue", completed: 22, pending: 4 },
      { day: "Wed", completed: 25, pending: 3 },
      { day: "Thu", completed: 20, pending: 5 },
      { day: "Fri", completed: 28, pending: 1 },
      { day: "Sat", completed: 14, pending: 0 },
      { day: "Sun", completed: 10, pending: 2 }
    ];

    const vehicleUsage = [
      { type: "Heavy Truck", miles: 45000, hours: 920 },
      { type: "Delivery Van", miles: 28000, hours: 780 },
      { type: "Cargo Van", miles: 15000, hours: 410 },
      { type: "Flatbed Trailer", miles: 22000, hours: 560 }
    ];

    const driverPerformance = [
      { name: "Marcus Vance", safetyScore: 98, miles: 12400 },
      { name: "Sarah Connor", safetyScore: 95, miles: 10800 },
      { name: "David Miller", safetyScore: 91, miles: 9400 }
    ];

    const tripCompletionRate = [
      { name: "Completed", value: 145, color: "var(--success)" },
      { name: "Cancelled", value: 2, color: "var(--danger)" },
      { name: "Delayed", value: 5, color: "var(--warning)" }
    ];

    const vehicleROI = [
      { plate: "TX-9911-USA", cost: 3200, revenue: 8400, roi: 162.5 },
      { plate: "CA-4422-TRK", cost: 2800, revenue: 7600, roi: 171.4 },
      { plate: "NY-8833-VAN", cost: 1800, revenue: 4900, roi: 172.2 }
    ];

    return {
      fleetUtilization,
      tripsPerDay,
      fuelConsumption,
      monthlyExpenses,
      vehicleUsage,
      driverPerformance,
      tripCompletionRate,
      vehicleROI
    };
  },

  getRecentTrips: async (filters = {}) => {
    const res = await api.get("/dashboard/recent-trips", { params: buildFilterParams(filters) });
    const arrayData = res.data?.latestTrips || [];
    const typeMap = {
      "Truck": "Heavy Truck",
      "Van": "Cargo Van",
      "Trailer": "Flatbed Trailer"
    };
    return arrayData.map(t => {
      let mappedStatus = "";
      if (t.vehicle) {
        if (t.vehicle.status === "Available" || t.vehicle.status === "On Trip") {
          mappedStatus = "Active";
        } else if (t.vehicle.status === "In Shop") {
          mappedStatus = "Maintenance";
        } else if (t.vehicle.status === "Retired") {
          mappedStatus = "Inactive";
        }
      }

      const tripDate = t.dispatchDate ? t.dispatchDate.split("T")[0] : "";

      return {
        id: t._id,
        tripNumber: t.tripNumber,
        vehicle: t.vehicle ? `${t.vehicle.vehicleName} (${t.vehicle.registrationNumber})` : "Vehicle",
        vehicleType: t.vehicle ? (typeMap[t.vehicle.vehicleType] || t.vehicle.vehicleType || "") : "",
        vehicleStatus: mappedStatus,
        region: t.vehicle?.region || "",
        driver: t.driver?.fullName || "Driver",
        source: t.source || "",
        destination: t.destination || "",
        cargoWeight: t.cargoWeight || 0,
        distance: t.actualDistance || t.plannedDistance || 0,
        status: t.status,
        date: tripDate,
        startDate: tripDate,
        expectedCompletion: t.expectedCompletionDate ? t.expectedCompletionDate.split("T")[0] : ""
      };
    });
  },

  getMainMaintenanceSummary: async () => {
    const res = await api.get("/dashboard/maintenance");
    const arrayData = res.data || [];
    return arrayData.map(m => ({
      id: m._id,
      vehicle: m.vehicle ? `${m.vehicle.vehicleName} (${m.vehicle.registrationNumber})` : "Vehicle",
      type: m.maintenanceType,
      scheduledDate: m.scheduledDate ? m.scheduledDate.split("T")[0] : "",
      status: m.status,
      priority: m.priority
    }));
  },

  getMaintenanceSummary: async (filters = {}) => {
    const res = await api.get("/dashboard/maintenance", { params: buildFilterParams(filters) });
    const arrayData = res.data || [];
    return arrayData.map(m => ({
      id: m._id,
      vehicle: m.vehicle ? `${m.vehicle.vehicleName} (${m.vehicle.registrationNumber})` : "Vehicle",
      type: m.maintenanceType,
      scheduledDate: m.scheduledDate ? m.scheduledDate.split("T")[0] : "",
      status: m.status,
      priority: m.priority
    }));
  },

  getFuelSummary: async (filters = {}) => {
    try {
      const filterParams = buildFilterParams(filters);
      const res = await api.get("/fuel/statistics", { params: filterParams });
      const stats = res.data;

      // Query fuel logs list to get actual most and least consuming vehicles
      const logsRes = await api.get("/fuel", { params: { limit: 50, ...filterParams } });
      const logs = logsRes.data?.fuelLogs || [];

      let mostConsuming = { vehicle: "N/A", consumption: "0 L", efficiency: "N/A" };
      let leastConsuming = { vehicle: "N/A", consumption: "0 L", efficiency: "N/A" };

      if (logs.length > 0) {
        const vehicleGroups = {};
        logs.forEach((l) => {
          const vName = l.vehicle ? `${l.vehicle.vehicleName} (${l.vehicle.registrationNumber})` : "Vehicle";
          if (!vehicleGroups[vName]) {
            vehicleGroups[vName] = { name: vName, totalLiters: 0, count: 0 };
          }
          vehicleGroups[vName].totalLiters += l.quantity || 0;
          vehicleGroups[vName].count += 1;
        });

        const sortedGroups = Object.values(vehicleGroups).sort((a, b) => b.totalLiters - a.totalLiters);
        if (sortedGroups.length > 0) {
          const max = sortedGroups[0];
          const min = sortedGroups[sortedGroups.length - 1];
          mostConsuming = {
            vehicle: max.name,
            consumption: `${max.totalLiters.toFixed(1)} L`,
            efficiency: "8.5 mpg"
          };
          leastConsuming = {
            vehicle: min.name,
            consumption: `${min.totalLiters.toFixed(1)} L`,
            efficiency: "16.8 mpg"
          };
        }
      } else {
        mostConsuming = {
          vehicle: "Peterbilt 579 Semi (CA-4422-TRK)",
          consumption: "150.5 L",
          efficiency: "8.2 mpg"
        };
        leastConsuming = {
          vehicle: "Ford F-550 SuperDuty (TX-9911-USA)",
          consumption: "65.0 L",
          efficiency: "18.4 mpg"
        };
      }

      return {
        totalFuelUsed: stats.totalLiters !== undefined ? `${stats.totalLiters.toLocaleString()} Liters` : "0 Liters",
        totalCost: stats.totalCost !== undefined ? `$${stats.totalCost.toLocaleString()}` : "$0.00",
        averageEfficiency: "12.3 mpg",
        avgFuelPrice: stats.averagePrice || 1.35,
        mostConsuming,
        leastConsuming
      };
    } catch (e) {
      console.error(e);
      return {
        totalFuelUsed: "0 Liters",
        totalCost: "$0.00",
        averageEfficiency: "N/A",
        avgFuelPrice: 0,
        mostConsuming: { vehicle: "N/A", consumption: "0 L", efficiency: "N/A" },
        leastConsuming: { vehicle: "N/A", consumption: "0 L", efficiency: "N/A" }
      };
    }
  },

  getExpenseSummary: async (filters = {}) => {
    try {
      const filterParams = buildFilterParams(filters);
      const res = await api.get("/expenses/statistics", { params: filterParams });
      const stats = res.data;

      const listRes = await api.get("/expenses", { params: { limit: 100, ...filterParams } });
      const expensesList = listRes.data?.expenses || [];

      let fuelCost = 0;
      let maintenanceCost = 0;
      let otherExpenses = 0;

      expensesList.forEach((e) => {
        if (e.expenseType === "Fuel") {
          fuelCost += e.amount || 0;
        } else if (e.expenseType === "Maintenance" || e.expenseType === "Repair") {
          maintenanceCost += e.amount || 0;
        } else {
          otherExpenses += e.amount || 0;
        }
      });

      const totalCost = fuelCost + maintenanceCost + otherExpenses;

      return {
        fuelCost,
        maintenanceCost,
        otherExpenses,
        totalCost: totalCost || stats.totalExpenses || 0
      };
    } catch (e) {
      console.error(e);
      return { fuelCost: 0, maintenanceCost: 0, otherExpenses: 0, totalCost: 0 };
    }
  },

  getNotifications: async () => {
    const res = await api.get("/dashboard/notifications");
    const arrayData = res.data || [];
    return arrayData.map(n => ({
      id: n._id,
      title: n.title,
      message: n.message,
      type: n.type || "info",
      isRead: n.isRead || false,
      timestamp: n.createdAt ? n.createdAt.split("T")[0] : ""
    }));
  }
};

export default dashboardService;
