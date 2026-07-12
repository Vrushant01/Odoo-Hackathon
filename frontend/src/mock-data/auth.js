export const MOCK_USERS = [
  {
    id: "user-1",
    email: "manager@transitops.com",
    password: "password",
    name: "Sarah Jenkins",
    role: "Fleet Manager",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    permissions: ["dashboard:view", "vehicles:view", "vehicles:create", "vehicles:edit", "vehicles:delete", "drivers:view", "drivers:create", "drivers:edit", "drivers:delete", "trips:view", "trips:create", "trips:edit", "maintenance:view", "maintenance:create", "maintenance:edit", "fuel:view", "fuel:create", "reports:view", "settings:view", "settings:edit"]
  },
  {
    id: "user-2",
    email: "dispatcher@transitops.com",
    password: "password",
    name: "Michael Chen",
    role: "Dispatcher",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120",
    permissions: ["dashboard:view", "vehicles:view", "drivers:view", "trips:view", "trips:create", "trips:edit", "trips:delete", "maintenance:view", "fuel:view"]
  },
  {
    id: "user-3",
    email: "safety@transitops.com",
    password: "password",
    name: "Marcus Vance",
    role: "Safety Officer",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120",
    permissions: ["dashboard:view", "vehicles:view", "drivers:view", "drivers:edit", "trips:view", "maintenance:view", "maintenance:edit", "reports:view"]
  },
  {
    id: "user-4",
    email: "finance@transitops.com",
    password: "password",
    name: "Elena Rostova",
    role: "Financial Analyst",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120",
    permissions: ["dashboard:view", "fuel:view", "fuel:create", "fuel:edit", "fuel:delete", "reports:view", "settings:view"]
  }
];

export const MOCK_ROLES = [
  "Fleet Manager",
  "Dispatcher",
  "Safety Officer",
  "Financial Analyst"
];
