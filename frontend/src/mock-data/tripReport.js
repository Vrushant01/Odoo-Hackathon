export const TRIP_REPORT = {
  summary: {
    totalTrips: 186,
    completedTrips: 152,
    inProgressTrips: 12,
    cancelledTrips: 14,
    scheduledTrips: 8,
    completionRate: 81.7,
    cancellationRate: 7.5,
    avgDistance: 485,
    avgCargoWeight: 12.4,
    avgDuration: 6.8
  },
  tripsPerMonth: [
    { month: "Jan", total: 28, completed: 24, cancelled: 2 },
    { month: "Feb", total: 30, completed: 26, cancelled: 1 },
    { month: "Mar", total: 32, completed: 27, cancelled: 3 },
    { month: "Apr", total: 35, completed: 29, cancelled: 2 },
    { month: "May", total: 31, completed: 25, cancelled: 4 },
    { month: "Jun", total: 30, completed: 21, cancelled: 2 }
  ],
  tripsPerWeek: [
    { week: "W1", trips: 8 },
    { week: "W2", trips: 7 },
    { week: "W3", trips: 9 },
    { week: "W4", trips: 6 }
  ],
  tripsPerDay: [
    { day: "Mon", trips: 5 },
    { day: "Tue", trips: 6 },
    { day: "Wed", trips: 4 },
    { day: "Thu", trips: 7 },
    { day: "Fri", trips: 5 },
    { day: "Sat", trips: 2 },
    { day: "Sun", trips: 1 }
  ],
  tripStatusDistribution: [
    { name: "Completed", value: 152, color: "var(--success)" },
    { name: "In Progress", value: 12, color: "var(--primary)" },
    { name: "Cancelled", value: 14, color: "var(--danger)" },
    { name: "Scheduled", value: 8, color: "var(--info)" }
  ],
  distanceDistribution: [
    { range: "0-200 km", count: 32 },
    { range: "200-500 km", count: 68 },
    { range: "500-1000 km", count: 54 },
    { range: "1000-2000 km", count: 24 },
    { range: "2000+ km", count: 8 }
  ],
  cargoWeightTrend: [
    { month: "Jan", avgWeight: 11.2 },
    { month: "Feb", avgWeight: 12.0 },
    { month: "Mar", avgWeight: 13.1 },
    { month: "Apr", avgWeight: 12.8 },
    { month: "May", avgWeight: 11.9 },
    { month: "Jun", avgWeight: 12.4 }
  ],
  durationDistribution: [
    { range: "0-4 hrs", count: 28 },
    { range: "4-8 hrs", count: 72 },
    { range: "8-12 hrs", count: 48 },
    { range: "12-24 hrs", count: 26 },
    { range: "24+ hrs", count: 12 }
  ]
};
