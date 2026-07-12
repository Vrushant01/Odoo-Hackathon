export const MOCK_SETTINGS = {
  general: {
    systemName: "TransitOps Platform",
    companyName: "TransitOps Logistics Corp",
    timezone: "UTC",
    currency: "USD",
    dateFormat: "YYYY-MM-DD",
    maintenanceInterval: 10000 // miles
  },
  roles: {
    "Fleet Manager": {
      permissions: ["*"],
      description: "Full read and write control over all modules, fleet configurations, and settings."
    },
    "Dispatcher": {
      permissions: ["dashboard:view", "vehicles:view", "drivers:view", "trips:view", "trips:create", "trips:edit", "trips:delete", "maintenance:view", "fuel:view"],
      description: "Manage and assign vehicles and drivers to trips, monitor active operations."
    },
    "Safety Officer": {
      permissions: ["dashboard:view", "vehicles:view", "drivers:view", "drivers:edit", "trips:view", "maintenance:view", "maintenance:edit", "reports:view"],
      description: "Monitor driver safety logs and vehicle inspections, manage compliance reports."
    },
    "Financial Analyst": {
      permissions: ["dashboard:view", "fuel:view", "fuel:create", "fuel:edit", "fuel:delete", "reports:view", "settings:view"],
      description: "Access expenses, fuel invoices, reports, and overall cost sheets."
    }
  }
};
