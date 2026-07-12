export const MOCK_DASHBOARD_CHARTS = {
  fleetUtilization: [
    { name: "Week 1", utilization: 72 },
    { name: "Week 2", utilization: 75 },
    { name: "Week 3", utilization: 78 },
    { name: "Week 4", utilization: 82 },
    { name: "Week 5", utilization: 79 },
    { name: "Week 6", utilization: 84 }
  ],
  tripsPerDay: [
    { day: "Mon", completed: 18, pending: 2 },
    { day: "Tue", completed: 22, pending: 4 },
    { day: "Wed", completed: 25, pending: 3 },
    { day: "Thu", completed: 20, pending: 5 },
    { day: "Fri", completed: 28, pending: 1 },
    { day: "Sat", completed: 14, pending: 0 },
    { day: "Sun", completed: 10, pending: 2 }
  ],
  fuelConsumption: [
    { month: "Jan", consumption: 3800, averageEfficiency: 7.2 },
    { month: "Feb", consumption: 4100, averageEfficiency: 7.4 },
    { month: "Mar", consumption: 3900, averageEfficiency: 7.3 },
    { month: "Apr", consumption: 4300, averageEfficiency: 7.5 },
    { month: "May", consumption: 4500, averageEfficiency: 7.6 },
    { month: "Jun", consumption: 4250, averageEfficiency: 7.8 }
  ],
  monthlyExpenses: [
    { month: "Jan", fuel: 4800, maintenance: 2500, other: 1000 },
    { month: "Feb", fuel: 5200, maintenance: 3100, other: 1100 },
    { month: "Mar", fuel: 5000, maintenance: 2800, other: 1000 },
    { month: "Apr", fuel: 5600, maintenance: 3500, other: 1200 },
    { month: "May", fuel: 6100, maintenance: 4200, other: 1300 },
    { month: "Jun", fuel: 5950, maintenance: 3400, other: 1200 }
  ],
  vehicleUsage: [
    { type: "Heavy Truck", miles: 45000, hours: 920 },
    { type: "Delivery Van", miles: 28000, hours: 780 },
    { type: "Cargo Van", miles: 15000, hours: 410 },
    { type: "Flatbed Trailer", miles: 22000, hours: 560 }
  ],
  driverPerformance: [
    { name: "Marcus Vance", safetyScore: 98, miles: 12400 },
    { name: "Sarah Connor", safetyScore: 95, miles: 10800 },
    { name: "David Miller", safetyScore: 91, miles: 9400 },
    { name: "John Doe", safetyScore: 85, miles: 6800 },
    { name: "Alex Jones", safetyScore: 89, miles: 8100 }
  ],
  tripCompletionRate: [
    { name: "Completed", value: 145, color: "var(--success)" },
    { name: "Cancelled", value: 2, color: "var(--danger)" },
    { name: "Delayed", value: 5, color: "var(--warning)" }
  ],
  vehicleROI: [
    { plate: "TX-9082", cost: 3200, revenue: 8400, roi: 162.5 },
    { plate: "NY-8832", cost: 2800, revenue: 7600, roi: 171.4 },
    { plate: "FL-1278", cost: 1800, revenue: 4900, roi: 172.2 },
    { plate: "CA-4521", cost: 1200, revenue: 2100, roi: 75.0 },
    { plate: "NV-5092", cost: 950, revenue: 1200, roi: 26.3 }
  ]
};
export default MOCK_DASHBOARD_CHARTS;
