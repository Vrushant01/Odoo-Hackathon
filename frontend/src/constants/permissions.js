export const ROLES = {
  SUPER_ADMIN: "Super Admin",
  FLEET_MANAGER: "Fleet Manager",
  DISPATCHER: "Dispatcher",
  SAFETY_OFFICER: "Safety Officer",
  FINANCIAL_ANALYST: "Financial Analyst"
};

export const PERMISSIONS = {
  DASHBOARD_VIEW: "dashboard:view",
  VEHICLES_VIEW: "vehicles:view",
  VEHICLES_MANAGE: "vehicles:manage",
  DRIVERS_VIEW: "drivers:view",
  DRIVERS_MANAGE: "drivers:manage",
  TRIPS_VIEW: "trips:view",
  TRIPS_MANAGE: "trips:manage",
  MAINTENANCE_VIEW: "maintenance:view",
  MAINTENANCE_MANAGE: "maintenance:manage",
  FUEL_VIEW: "fuel:view",
  FUEL_MANAGE: "fuel:manage",
  REPORTS_VIEW: "reports:view",
  SETTINGS_VIEW: "settings:view",
  SETTINGS_MANAGE: "settings:manage",
  USERS_VIEW: "users:view",
  USERS_MANAGE: "users:manage"
};

// Maps roles to their permitted access tags
export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_MANAGE
  ],
  [ROLES.FLEET_MANAGER]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.VEHICLES_VIEW,
    PERMISSIONS.VEHICLES_MANAGE,
    PERMISSIONS.DRIVERS_VIEW,
    PERMISSIONS.DRIVERS_MANAGE,
    PERMISSIONS.TRIPS_VIEW,
    PERMISSIONS.TRIPS_MANAGE,
    PERMISSIONS.MAINTENANCE_VIEW,
    PERMISSIONS.MAINTENANCE_MANAGE,
    PERMISSIONS.FUEL_VIEW,
    PERMISSIONS.FUEL_MANAGE,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_MANAGE
  ],
  [ROLES.DISPATCHER]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.VEHICLES_VIEW,
    PERMISSIONS.DRIVERS_VIEW,
    PERMISSIONS.TRIPS_VIEW,
    PERMISSIONS.TRIPS_MANAGE,
    PERMISSIONS.MAINTENANCE_VIEW,
    PERMISSIONS.FUEL_VIEW
  ],
  [ROLES.SAFETY_OFFICER]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.VEHICLES_VIEW,
    PERMISSIONS.DRIVERS_VIEW,
    PERMISSIONS.DRIVERS_MANAGE, // Safety Officer can edit safety info
    PERMISSIONS.TRIPS_VIEW,
    PERMISSIONS.MAINTENANCE_VIEW,
    PERMISSIONS.MAINTENANCE_MANAGE, // Safety Officer schedules inspections
    PERMISSIONS.REPORTS_VIEW
  ],
  [ROLES.FINANCIAL_ANALYST]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.FUEL_VIEW,
    PERMISSIONS.FUEL_MANAGE, // Log costs
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.SETTINGS_VIEW
  ]
};

// Sidebar Configuration items mapped to permissions
export const SIDEBAR_ITEMS = [
  {
    title: "Dashboard",
    icon: "LayoutDashboard",
    route: "/dashboard",
    permission: PERMISSIONS.DASHBOARD_VIEW
  },
  {
    title: "User Management",
    icon: "ShieldCheck",
    route: "/users",
    permission: PERMISSIONS.USERS_VIEW
  },
  {
    title: "Vehicles",
    icon: "Truck",
    route: "/vehicles",
    permission: PERMISSIONS.VEHICLES_VIEW
  },
  {
    title: "Drivers",
    icon: "Users",
    route: "/drivers",
    permission: PERMISSIONS.DRIVERS_VIEW
  },
  {
    title: "Trips",
    icon: "Route",
    route: "/trips",
    permission: PERMISSIONS.TRIPS_VIEW
  },
  {
    title: "Maintenance",
    icon: "Wrench",
    route: "/maintenance",
    permission: PERMISSIONS.MAINTENANCE_VIEW
  },
  {
    title: "Fuel & Expenses",
    icon: "Fuel",
    route: "/fuel",
    permission: PERMISSIONS.FUEL_VIEW
  },
  {
    title: "Reports & Analytics",
    icon: "BarChart3",
    route: "/reports",
    permission: PERMISSIONS.REPORTS_VIEW
  },
  {
    title: "Settings",
    icon: "Settings",
    route: "/settings",
    permission: PERMISSIONS.SETTINGS_VIEW
  }
];
