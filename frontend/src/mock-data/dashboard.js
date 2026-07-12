export const MOCK_DASHBOARD_STATS = {
  kpis: [
    { id: "active-vehicles", title: "Active Vehicles", value: "3", change: "+12% from last week", trend: "up", type: "number" },
    { id: "active-trips", title: "Active Trips", value: "2", change: "On schedule", trend: "neutral", type: "number" },
    { id: "maintenance-pending", title: "In Maintenance", value: "1", change: "-2 from yesterday", trend: "down", type: "number" },
    { id: "fuel-spend", title: "Fuel Spend (MTD)", value: "$665.25", change: "+5.4% vs target", trend: "up", type: "currency" }
  ],
  weeklyTrips: [
    { day: "Mon", trips: 4, distance: 980 },
    { day: "Tue", trips: 6, distance: 1450 },
    { day: "Wed", trips: 5, distance: 1200 },
    { day: "Thu", trips: 7, distance: 1850 },
    { day: "Fri", trips: 8, distance: 2100 },
    { day: "Sat", trips: 3, distance: 750 },
    { day: "Sun", trips: 2, distance: 480 }
  ],
  fuelTrends: [
    { month: "Jan", cost: 1200, liters: 980 },
    { month: "Feb", cost: 1400, liters: 1100 },
    { month: "Mar", cost: 1100, liters: 890 },
    { month: "Apr", cost: 1350, liters: 1050 },
    { month: "May", cost: 1600, liters: 1250 },
    { month: "Jun", cost: 1550, liters: 1200 },
    { month: "Jul", cost: 665, liters: 466 }
  ],
  vehicleStatusDistribution: [
    { name: "Active", value: 3, color: "#10b981" },
    { name: "Maintenance", value: 1, color: "#f59e0b" },
    { name: "Inactive", value: 1, color: "#ef4444" }
  ],
  recentAlerts: [
    { id: "alert-1", type: "critical", message: "Vehicle TX-9082 reports low tire pressure", time: "10m ago" },
    { id: "alert-2", type: "warning", message: "Driver John Doe safety rating dropped below 88%", time: "1h ago" },
    { id: "alert-3", type: "info", message: "Scheduled maintenance for Vehicle NY-8832 is tomorrow", time: "3h ago" }
  ]
};
