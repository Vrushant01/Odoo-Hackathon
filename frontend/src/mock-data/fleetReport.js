export const FLEET_REPORT = {
  summary: {
    totalVehicles: 24,
    activeVehicles: 18,
    inMaintenance: 3,
    retired: 2,
    idle: 1,
    fleetUtilization: 75,
    avgAge: 3.2,
    totalMileage: 482500
  },
  vehicleStatusDistribution: [
    { name: "Active", value: 18, color: "var(--success)" },
    { name: "In Maintenance", value: 3, color: "var(--warning)" },
    { name: "Retired", value: 2, color: "var(--danger)" },
    { name: "Idle", value: 1, color: "var(--text-muted)" }
  ],
  vehicleTypeDistribution: [
    { name: "Heavy Truck", value: 8, color: "var(--primary)" },
    { name: "Delivery Van", value: 6, color: "var(--success)" },
    { name: "Tanker", value: 4, color: "var(--warning)" },
    { name: "Flatbed", value: 3, color: "var(--info)" },
    { name: "Refrigerated", value: 3, color: "var(--danger)" }
  ],
  utilizationTrend: [
    { month: "Jan", utilization: 68 },
    { month: "Feb", utilization: 72 },
    { month: "Mar", utilization: 70 },
    { month: "Apr", utilization: 75 },
    { month: "May", utilization: 78 },
    { month: "Jun", utilization: 75 }
  ],
  vehicleAvailability: [
    { month: "Jan", available: 20, unavailable: 4 },
    { month: "Feb", available: 19, unavailable: 5 },
    { month: "Mar", available: 21, unavailable: 3 },
    { month: "Apr", available: 18, unavailable: 6 },
    { month: "May", available: 20, unavailable: 4 },
    { month: "Jun", available: 18, unavailable: 6 }
  ],
  downtimeByVehicle: [
    { vehicle: "Volvo FH16 (FL-1001)", downtime: 12 },
    { vehicle: "MAN TGX (FL-1005)", downtime: 9 },
    { vehicle: "Scania R500 (FL-1008)", downtime: 7 },
    { vehicle: "DAF XF (FL-1012)", downtime: 5 },
    { vehicle: "Iveco Stralis (FL-1015)", downtime: 4 }
  ],
  mostUsedVehicles: [
    { vehicle: "Mercedes Actros (FL-1002)", trips: 42, distance: 18500, utilization: 92 },
    { vehicle: "Volvo FH16 (FL-1001)", trips: 38, distance: 16200, utilization: 88 },
    { vehicle: "MAN TGX (FL-1005)", trips: 35, distance: 15800, utilization: 85 }
  ],
  leastUsedVehicles: [
    { vehicle: "Iveco Stralis (FL-1015)", trips: 8, distance: 3200, utilization: 32 },
    { vehicle: "DAF CF (FL-1018)", trips: 12, distance: 4800, utilization: 40 },
    { vehicle: "Renault T (FL-1020)", trips: 14, distance: 5100, utilization: 45 }
  ],
  vehiclePerformanceTable: [
    { vehicle: "Mercedes Actros (FL-1002)", trips: 42, distance: 18500, fuelUsed: 4625, maintenanceCost: 2800, fuelEfficiency: 4.0, operationalCost: 12400, roi: 18.5 },
    { vehicle: "Volvo FH16 (FL-1001)", trips: 38, distance: 16200, fuelUsed: 4320, maintenanceCost: 3200, fuelEfficiency: 3.75, operationalCost: 11800, roi: 16.2 },
    { vehicle: "MAN TGX (FL-1005)", trips: 35, distance: 15800, fuelUsed: 3950, maintenanceCost: 1500, fuelEfficiency: 4.0, operationalCost: 9200, roi: 22.1 },
    { vehicle: "Scania R500 (FL-1008)", trips: 30, distance: 14200, fuelUsed: 3550, maintenanceCost: 4100, fuelEfficiency: 4.0, operationalCost: 13500, roi: 12.8 },
    { vehicle: "DAF XF (FL-1012)", trips: 25, distance: 11500, fuelUsed: 3070, maintenanceCost: 2200, fuelEfficiency: 3.75, operationalCost: 8900, roi: 15.4 },
    { vehicle: "Iveco Stralis (FL-1015)", trips: 8, distance: 3200, fuelUsed: 960, maintenanceCost: 1800, fuelEfficiency: 3.33, operationalCost: 4800, roi: 5.2 },
    { vehicle: "DAF CF (FL-1018)", trips: 12, distance: 4800, fuelUsed: 1200, maintenanceCost: 900, fuelEfficiency: 4.0, operationalCost: 3600, roi: 11.0 },
    { vehicle: "Renault T (FL-1020)", trips: 14, distance: 5100, fuelUsed: 1360, maintenanceCost: 1100, fuelEfficiency: 3.75, operationalCost: 4200, roi: 9.5 }
  ]
};
