// Consolidated chart datasets for the analytics module
export const ANALYTICS_CHARTS = {
  // Fleet Charts
  fleetUtilization: [
    { month: "Jan", utilization: 68 },
    { month: "Feb", utilization: 72 },
    { month: "Mar", utilization: 70 },
    { month: "Apr", utilization: 75 },
    { month: "May", utilization: 78 },
    { month: "Jun", utilization: 75 }
  ],
  vehicleUsageComparison: [
    { vehicle: "Mercedes Actros", trips: 42, distance: 18500 },
    { vehicle: "Volvo FH16", trips: 38, distance: 16200 },
    { vehicle: "MAN TGX", trips: 35, distance: 15800 },
    { vehicle: "Scania R500", trips: 30, distance: 14200 },
    { vehicle: "DAF XF", trips: 25, distance: 11500 }
  ],

  // Driver Charts
  driverPerformanceComparison: [
    { driver: "James R.", safetyScore: 95, trips: 28, efficiency: 4.2 },
    { driver: "Sarah M.", safetyScore: 93, trips: 25, efficiency: 4.0 },
    { driver: "Marcus C.", safetyScore: 90, trips: 22, efficiency: 3.9 },
    { driver: "Elena P.", safetyScore: 88, trips: 20, efficiency: 3.8 },
    { driver: "David K.", safetyScore: 85, trips: 18, efficiency: 3.7 }
  ],

  // Trip Charts
  tripVolumeTrend: [
    { month: "Jan", completed: 24, cancelled: 2, inProgress: 2 },
    { month: "Feb", completed: 26, cancelled: 1, inProgress: 3 },
    { month: "Mar", completed: 27, cancelled: 3, inProgress: 2 },
    { month: "Apr", completed: 29, cancelled: 2, inProgress: 4 },
    { month: "May", completed: 25, cancelled: 4, inProgress: 2 },
    { month: "Jun", completed: 21, cancelled: 2, inProgress: 7 }
  ],

  // Maintenance Charts
  maintenanceCostVsFrequency: [
    { month: "Jan", cost: 7200, count: 10 },
    { month: "Feb", cost: 6800, count: 10 },
    { month: "Mar", cost: 8500, count: 13 },
    { month: "Apr", cost: 7900, count: 11 },
    { month: "May", cost: 9100, count: 12 },
    { month: "Jun", cost: 9000, count: 12 }
  ],

  // Fuel Charts
  fuelEfficiencyComparison: [
    { vehicle: "Mercedes Actros", efficiency: 4.2 },
    { vehicle: "MAN TGX", efficiency: 4.0 },
    { vehicle: "DAF CF", efficiency: 4.0 },
    { vehicle: "Volvo FH16", efficiency: 3.75 },
    { vehicle: "Scania R500", efficiency: 3.70 },
    { vehicle: "DAF XF", efficiency: 3.65 },
    { vehicle: "Iveco Stralis", efficiency: 3.33 }
  ],

  // Expense Charts
  expenseTrendComparison: [
    { month: "Jan", fuel: 5700, maintenance: 7200, tolls: 680 },
    { month: "Feb", fuel: 5400, maintenance: 6800, tolls: 710 },
    { month: "Mar", fuel: 6300, maintenance: 8500, tolls: 750 },
    { month: "Apr", fuel: 6150, maintenance: 7900, tolls: 690 },
    { month: "May", fuel: 6750, maintenance: 9100, tolls: 700 },
    { month: "Jun", fuel: 6975, maintenance: 9000, tolls: 670 }
  ],

  // Profitability Charts
  profitMarginTrend: [
    { month: "Jan", margin: 63.2 },
    { month: "Feb", margin: 63.1 },
    { month: "Mar", margin: 61.8 },
    { month: "Apr", margin: 62.0 },
    { month: "May", margin: 61.4 },
    { month: "Jun", margin: 61.9 }
  ]
};
