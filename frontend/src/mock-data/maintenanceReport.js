export const MAINTENANCE_REPORT = {
  summary: {
    totalRecords: 68,
    completedMaintenance: 52,
    inProgressMaintenance: 8,
    scheduledMaintenance: 5,
    cancelledMaintenance: 3,
    preventiveCount: 38,
    correctiveCount: 30,
    avgDowntimeDays: 3.2,
    totalCost: 48500,
    avgCostPerRecord: 712.5
  },
  costTrend: [
    { month: "Jan", cost: 7200 },
    { month: "Feb", cost: 6800 },
    { month: "Mar", cost: 8500 },
    { month: "Apr", cost: 7900 },
    { month: "May", cost: 9100 },
    { month: "Jun", cost: 9000 }
  ],
  frequencyTrend: [
    { month: "Jan", preventive: 6, corrective: 4 },
    { month: "Feb", preventive: 5, corrective: 5 },
    { month: "Mar", preventive: 7, corrective: 6 },
    { month: "Apr", preventive: 6, corrective: 5 },
    { month: "May", preventive: 8, corrective: 4 },
    { month: "Jun", preventive: 6, corrective: 6 }
  ],
  maintenanceTypeDistribution: [
    { name: "Preventive", value: 38, color: "var(--success)" },
    { name: "Corrective", value: 30, color: "var(--warning)" }
  ],
  repairCountByVehicle: [
    { vehicle: "Volvo FH16 (FL-1001)", repairs: 8 },
    { vehicle: "Scania R500 (FL-1008)", repairs: 7 },
    { vehicle: "MAN TGX (FL-1005)", repairs: 6 },
    { vehicle: "DAF XF (FL-1012)", repairs: 5 },
    { vehicle: "Mercedes Actros (FL-1002)", repairs: 4 }
  ],
  workshopUtilization: [
    { workshop: "Central Depot", jobs: 28, capacity: 35, utilization: 80 },
    { workshop: "East Bay Workshop", jobs: 18, capacity: 25, utilization: 72 },
    { workshop: "South Terminal", jobs: 14, capacity: 20, utilization: 70 },
    { workshop: "Mobile Unit A", jobs: 8, capacity: 10, utilization: 80 }
  ],
  maintenanceCostTable: [
    { vehicle: "Volvo FH16 (FL-1001)", maintenanceCount: 8, totalCost: 9200, avgCost: 1150, downtime: 14 },
    { vehicle: "Scania R500 (FL-1008)", maintenanceCount: 7, totalCost: 8400, avgCost: 1200, downtime: 12 },
    { vehicle: "MAN TGX (FL-1005)", maintenanceCount: 6, totalCost: 5800, avgCost: 967, downtime: 9 },
    { vehicle: "Mercedes Actros (FL-1002)", maintenanceCount: 4, totalCost: 4200, avgCost: 1050, downtime: 6 },
    { vehicle: "DAF XF (FL-1012)", maintenanceCount: 5, totalCost: 4800, avgCost: 960, downtime: 8 },
    { vehicle: "Iveco Stralis (FL-1015)", maintenanceCount: 3, totalCost: 3600, avgCost: 1200, downtime: 5 },
    { vehicle: "DAF CF (FL-1018)", maintenanceCount: 2, totalCost: 1800, avgCost: 900, downtime: 3 },
    { vehicle: "Renault T (FL-1020)", maintenanceCount: 3, totalCost: 2400, avgCost: 800, downtime: 4 }
  ]
};
