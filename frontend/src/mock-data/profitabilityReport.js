export const PROFITABILITY_REPORT = {
  summary: {
    totalRevenue: 245000,
    totalFuelCost: 37275,
    totalMaintenanceCost: 48500,
    totalRepairCost: 12800,
    totalOtherExpenses: 12425,
    totalExpenses: 111000,
    netProfit: 134000,
    roi: 120.7,
    costPerVehicle: 4625,
    costPerTrip: 597,
    revenuePerTrip: 1317,
    profitMargin: 54.7
  },
  monthlyProfitTrend: [
    { month: "Jan", revenue: 38000, expenses: 14000, profit: 24000 },
    { month: "Feb", revenue: 36000, expenses: 13290, profit: 22710 },
    { month: "Mar", revenue: 42000, expenses: 16060, profit: 25940 },
    { month: "Apr", revenue: 40000, expenses: 15200, profit: 24800 },
    { month: "May", revenue: 44000, expenses: 16990, profit: 27010 },
    { month: "Jun", revenue: 45000, expenses: 17135, profit: 27865 }
  ],
  revenueVsCost: [
    { month: "Jan", revenue: 38000, cost: 14000 },
    { month: "Feb", revenue: 36000, cost: 13290 },
    { month: "Mar", revenue: 42000, cost: 16060 },
    { month: "Apr", revenue: 40000, cost: 15200 },
    { month: "May", revenue: 44000, cost: 16990 },
    { month: "Jun", revenue: 45000, cost: 17135 }
  ],
  costBreakdown: [
    { name: "Fuel", value: 37275, color: "var(--primary)" },
    { name: "Maintenance", value: 48500, color: "var(--warning)" },
    { name: "Repairs", value: 12800, color: "var(--danger)" },
    { name: "Other", value: 12425, color: "var(--text-muted)" }
  ],
  vehicleProfitability: [
    { vehicle: "Mercedes Actros (FL-1002)", revenue: 55200, cost: 12400, profit: 42800, roi: 345 },
    { vehicle: "MAN TGX (FL-1005)", revenue: 46800, cost: 9200, profit: 37600, roi: 409 },
    { vehicle: "Volvo FH16 (FL-1001)", revenue: 50400, cost: 11800, profit: 38600, roi: 327 },
    { vehicle: "DAF XF (FL-1012)", revenue: 32500, cost: 8900, profit: 23600, roi: 265 },
    { vehicle: "Scania R500 (FL-1008)", revenue: 39200, cost: 13500, profit: 25700, roi: 190 },
    { vehicle: "Iveco Stralis (FL-1015)", revenue: 10800, cost: 4800, profit: 6000, roi: 125 }
  ],
  monthlyPnL: [
    { month: "Jan", revenue: 38000, fuel: 5700, maintenance: 7200, tolls: 680, other: 420, totalCost: 14000, netProfit: 24000, margin: 63.2 },
    { month: "Feb", revenue: 36000, fuel: 5400, maintenance: 6800, tolls: 710, other: 380, totalCost: 13290, netProfit: 22710, margin: 63.1 },
    { month: "Mar", revenue: 42000, fuel: 6300, maintenance: 8500, tolls: 750, other: 510, totalCost: 16060, netProfit: 25940, margin: 61.8 },
    { month: "Apr", revenue: 40000, fuel: 6150, maintenance: 7900, tolls: 690, other: 460, totalCost: 15200, netProfit: 24800, margin: 62.0 },
    { month: "May", revenue: 44000, fuel: 6750, maintenance: 9100, tolls: 700, other: 440, totalCost: 16990, netProfit: 27010, margin: 61.4 },
    { month: "Jun", revenue: 45000, fuel: 6975, maintenance: 9000, tolls: 670, other: 490, totalCost: 17135, netProfit: 27865, margin: 61.9 }
  ]
};
