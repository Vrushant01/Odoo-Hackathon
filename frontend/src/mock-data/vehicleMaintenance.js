export const MOCK_VEHICLE_MAINTENANCE = {
  "veh-1": [
    { id: "maint-2", type: "Routine", description: "Engine oil change, oil filter, and tire rotation", status: "Completed", cost: 180.00, scheduledDate: "2026-06-15", mechanic: "Dave Miller" },
    { id: "maint-98", type: "Inspection", description: "Safety diagnostics and alignment check", status: "Completed", cost: 95.00, scheduledDate: "2026-03-12", mechanic: "Alex Rover" }
  ],
  "veh-2": [
    { id: "maint-1", type: "Repair", description: "Brake pad replacement and rotor resurfacing", status: "In Progress", cost: 450.00, scheduledDate: "2026-07-11", mechanic: "Alex Rover" },
    { id: "maint-91", type: "Routine", description: "Standard scheduled maintenance", status: "Completed", cost: 150.00, scheduledDate: "2026-01-15", mechanic: "Dave Miller" }
  ],
  "veh-3": [
    { id: "maint-4", type: "Routine", description: "Transmission fluid flush and filter replacement", status: "Scheduled", cost: 320.00, scheduledDate: "2026-07-20", mechanic: "Sarah Jenkins" }
  ],
  "veh-4": [
    { id: "maint-3", type: "Inspection", description: "Annual safety inspection and emission testing", status: "Completed", cost: 85.00, scheduledDate: "2026-06-28", mechanic: "Mike Chen" }
  ],
  "veh-5": [
    { id: "maint-80", type: "Repair", description: "Engine overhaul", status: "Completed", cost: 3200.00, scheduledDate: "2026-04-10", mechanic: "Alex Rover" }
  ]
};
export default MOCK_VEHICLE_MAINTENANCE;
