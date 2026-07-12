export const EXPENSE_REPORT = {
  summary: {
    totalExpenses: 98200,
    fuelExpenses: 37275,
    maintenanceExpenses: 48500,
    tollExpenses: 4200,
    insuranceExpenses: 3800,
    parkingExpenses: 1200,
    finesExpenses: 850,
    otherExpenses: 2375,
    monthlyAvg: 16367,
    avgPerTrip: 528,
    avgPerVehicle: 4092
  },
  monthlyExpenses: [
    { month: "Jan", fuel: 5700, maintenance: 7200, tolls: 680, other: 420 },
    { month: "Feb", fuel: 5400, maintenance: 6800, tolls: 710, other: 380 },
    { month: "Mar", fuel: 6300, maintenance: 8500, tolls: 750, other: 510 },
    { month: "Apr", fuel: 6150, maintenance: 7900, tolls: 690, other: 460 },
    { month: "May", fuel: 6750, maintenance: 9100, tolls: 700, other: 440 },
    { month: "Jun", fuel: 6975, maintenance: 9000, tolls: 670, other: 490 }
  ],
  categoryDistribution: [
    { name: "Fuel", value: 37275, color: "var(--primary)" },
    { name: "Maintenance", value: 48500, color: "var(--warning)" },
    { name: "Tolls", value: 4200, color: "var(--success)" },
    { name: "Insurance", value: 3800, color: "var(--info)" },
    { name: "Parking", value: 1200, color: "var(--text-muted)" },
    { name: "Fines & Other", value: 3225, color: "var(--danger)" }
  ],
  vehicleExpenses: [
    { vehicle: "Volvo FH16 (FL-1001)", fuel: 6480, maintenance: 9200, tolls: 850, total: 16530 },
    { vehicle: "Mercedes Actros (FL-1002)", fuel: 6938, maintenance: 4200, tolls: 920, total: 12058 },
    { vehicle: "MAN TGX (FL-1005)", fuel: 5925, maintenance: 5800, tolls: 680, total: 12405 },
    { vehicle: "Scania R500 (FL-1008)", fuel: 5325, maintenance: 8400, tolls: 620, total: 14345 },
    { vehicle: "DAF XF (FL-1012)", fuel: 4605, maintenance: 4800, tolls: 540, total: 9945 }
  ],
  tripExpenses: [
    { tripId: "TR-001", fuel: 280, maintenance: 0, tolls: 45, other: 12, total: 337 },
    { tripId: "TR-002", fuel: 340, maintenance: 0, tolls: 65, other: 18, total: 423 },
    { tripId: "TR-003", fuel: 190, maintenance: 120, tolls: 30, other: 8, total: 348 },
    { tripId: "TR-004", fuel: 420, maintenance: 0, tolls: 80, other: 25, total: 525 },
    { tripId: "TR-005", fuel: 260, maintenance: 0, tolls: 55, other: 15, total: 330 }
  ],
  operationalCostTrend: [
    { month: "Jan", cost: 14000 },
    { month: "Feb", cost: 13290 },
    { month: "Mar", cost: 16060 },
    { month: "Apr", cost: 15200 },
    { month: "May", cost: 16990 },
    { month: "Jun", cost: 17135 }
  ],
  expenseTable: [
    { category: "Fuel", amount: 37275, percentage: 38.0, vehicle: "All Vehicles", trip: "All Trips", date: "2026-06-30" },
    { category: "Maintenance", amount: 48500, percentage: 49.4, vehicle: "All Vehicles", trip: "N/A", date: "2026-06-30" },
    { category: "Tolls", amount: 4200, percentage: 4.3, vehicle: "All Vehicles", trip: "All Trips", date: "2026-06-30" },
    { category: "Insurance", amount: 3800, percentage: 3.9, vehicle: "All Vehicles", trip: "N/A", date: "2026-06-30" },
    { category: "Parking", amount: 1200, percentage: 1.2, vehicle: "All Vehicles", trip: "All Trips", date: "2026-06-30" },
    { category: "Fines", amount: 850, percentage: 0.9, vehicle: "Selected Vehicles", trip: "N/A", date: "2026-06-30" },
    { category: "Other", amount: 2375, percentage: 2.4, vehicle: "All Vehicles", trip: "Various", date: "2026-06-30" }
  ]
};
