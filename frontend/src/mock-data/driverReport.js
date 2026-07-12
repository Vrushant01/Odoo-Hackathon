export const DRIVER_REPORT = {
  summary: {
    totalDrivers: 16,
    activeDrivers: 12,
    suspendedDrivers: 2,
    onLeave: 2,
    avgSafetyScore: 87,
    avgTripsPerDriver: 14,
    licensesExpiringSoon: 3,
    avgRating: 4.2
  },
  performanceRankings: [
    { driver: "James Rodriguez", completedTrips: 28, cancelledTrips: 1, distance: 12400, safetyScore: 95, fuelEfficiency: 4.2, avgRating: 4.8 },
    { driver: "Sarah Mitchell", completedTrips: 25, cancelledTrips: 0, distance: 11200, safetyScore: 93, fuelEfficiency: 4.0, avgRating: 4.7 },
    { driver: "Marcus Chen", completedTrips: 22, cancelledTrips: 2, distance: 9800, safetyScore: 90, fuelEfficiency: 3.9, avgRating: 4.5 },
    { driver: "Elena Petrova", completedTrips: 20, cancelledTrips: 1, distance: 8500, safetyScore: 88, fuelEfficiency: 3.8, avgRating: 4.4 },
    { driver: "David Kim", completedTrips: 18, cancelledTrips: 3, distance: 7200, safetyScore: 85, fuelEfficiency: 3.7, avgRating: 4.2 },
    { driver: "Lisa Thompson", completedTrips: 15, cancelledTrips: 0, distance: 6800, safetyScore: 92, fuelEfficiency: 4.1, avgRating: 4.6 },
    { driver: "Robert Jackson", completedTrips: 12, cancelledTrips: 4, distance: 5100, safetyScore: 78, fuelEfficiency: 3.5, avgRating: 3.8 },
    { driver: "Ana Gonzalez", completedTrips: 10, cancelledTrips: 1, distance: 4200, safetyScore: 82, fuelEfficiency: 3.6, avgRating: 4.0 }
  ],
  utilizationTrend: [
    { month: "Jan", utilization: 72 },
    { month: "Feb", utilization: 75 },
    { month: "Mar", utilization: 78 },
    { month: "Apr", utilization: 74 },
    { month: "May", utilization: 80 },
    { month: "Jun", utilization: 76 }
  ],
  safetyScoreDistribution: [
    { range: "90-100", count: 4, color: "var(--success)" },
    { range: "80-89", count: 5, color: "var(--primary)" },
    { range: "70-79", count: 4, color: "var(--warning)" },
    { range: "60-69", count: 2, color: "var(--danger)" },
    { range: "Below 60", count: 1, color: "var(--text-muted)" }
  ],
  tripsPerDriver: [
    { driver: "James R.", trips: 28 },
    { driver: "Sarah M.", trips: 25 },
    { driver: "Marcus C.", trips: 22 },
    { driver: "Elena P.", trips: 20 },
    { driver: "David K.", trips: 18 },
    { driver: "Lisa T.", trips: 15 },
    { driver: "Robert J.", trips: 12 },
    { driver: "Ana G.", trips: 10 }
  ],
  licenseExpirySummary: [
    { status: "Valid (>6 months)", count: 10, color: "var(--success)" },
    { status: "Expiring Soon (<6 months)", count: 3, color: "var(--warning)" },
    { status: "Expired", count: 1, color: "var(--danger)" },
    { status: "Under Renewal", count: 2, color: "var(--info)" }
  ],
  mostActiveDriver: { name: "James Rodriguez", trips: 28, distance: 12400, safetyScore: 95 },
  leastActiveDriver: { name: "Ana Gonzalez", trips: 10, distance: 4200, safetyScore: 82 }
};
