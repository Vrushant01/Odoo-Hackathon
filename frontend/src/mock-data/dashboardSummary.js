export const MOCK_DASHBOARD_SUMMARY = {
  vehicles: {
    total: 24,
    available: 15,
    onTrip: 6,
    maintenance: 2,
    retired: 1
  },
  drivers: {
    total: 28,
    onDuty: 18,
    available: 8,
    offDuty: 1,
    suspended: 1,
    expiringLicense: 2
  },
  trips: {
    active: 6,
    pending: 4,
    completed: 145,
    cancelled: 2
  },
  financials: {
    utilization: 78.5,
    fuelConsumption: 4250, // Liters
    fuelCost: 5950,
    maintenanceCost: 3400,
    otherExpenses: 1200,
    operationalCost: 10550, // Sum of fuel, maintenance, other
    revenue: 24500,
    profit: 13950
  },
  expiringDrivers: [
    {
      id: "drv-2",
      name: "John Doe",
      license: "DL-CA63524",
      expiryDate: "2026-07-28",
      daysRemaining: 16,
      status: "Critical"
    },
    {
      id: "drv-5",
      name: "Alex Jones",
      license: "DL-TX48271",
      expiryDate: "2026-08-15",
      daysRemaining: 34,
      status: "Warning"
    }
  ]
};
export default MOCK_DASHBOARD_SUMMARY;
