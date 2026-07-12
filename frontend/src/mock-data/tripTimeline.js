export const MOCK_TRIP_TIMELINE = {
  "TR-1001": [
    { title: "Trip Completed", description: "Successfully delivered cargo. Final odometer: 112,300 mi.", date: "2026-07-11 14:30", type: "success" },
    { title: "Fuel Added", description: "Refueled 65 L at Shell Station, Miami, FL.", date: "2026-07-11 11:15", type: "fuel" },
    { title: "Checkpoint Reached", description: "Passed Toll Checkpoint #2 at Palm Beach, FL.", date: "2026-07-11 10:45", type: "checkpoint" },
    { title: "Trip Dispatched", description: "Dispatched from Miami Hub. Initial odometer: 112,065 mi.", date: "2026-07-11 09:00", type: "dispatch" },
    { title: "Driver Assigned", description: "David Miller assigned to trip.", date: "2026-07-10 16:30", type: "assignment" },
    { title: "Trip Created", description: "Trip order registered by dispatcher.", date: "2026-07-10 15:00", type: "creation" }
  ],
  "TR-1002": [
    { title: "Checkpoint Reached", description: "Passed Checkpoint #1 (I-45 Northbound, Huntsville, TX).", date: "2026-07-12 11:30", type: "checkpoint" },
    { title: "Trip Dispatched", description: "Dispatched from Houston Hub. Initial odometer: 145,200 mi.", date: "2026-07-12 09:00", type: "dispatch" },
    { title: "Vehicle Assigned", description: "Freightliner Cascadia (TX-9082) assigned.", date: "2026-07-11 10:30", type: "assignment" },
    { title: "Trip Created", description: "Trip order registered.", date: "2026-07-11 09:00", type: "creation" }
  ],
  "TR-1003": [
    { title: "Trip Dispatched", description: "Dispatched from NY Bronx Hub. Initial odometer: 88,900 mi.", date: "2026-07-12 10:00", type: "dispatch" },
    { title: "Driver Assigned", description: "Sarah Connor assigned.", date: "2026-07-11 15:30", type: "assignment" },
    { title: "Trip Created", description: "Trip order registered.", date: "2026-07-11 14:00", type: "creation" }
  ],
  "TR-1004": [
    { title: "Driver Assigned", description: "John Doe assigned to schedule.", date: "2026-07-12 10:30", type: "assignment" },
    { title: "Trip Created", description: "Draft trip order registered by operator.", date: "2026-07-12 10:00", type: "creation" }
  ],
  "TR-1005": [
    { title: "Trip Cancelled", description: "Trip cancelled. Reason: Refrigeration Unit Malfunction.", date: "2026-07-05 10:30", type: "cancel" },
    { title: "Trip Created", description: "Trip order registered.", date: "2026-07-05 08:00", type: "creation" }
  ],
  "TR-1006": [
    { title: "Trip Completed", description: "Successfully delivered cargo. Final odometer: 88,900 mi.", date: "2026-07-09 12:45", type: "success" },
    { title: "Trip Dispatched", description: "Dispatched from Philadelphia Hub.", date: "2026-07-09 10:00", type: "dispatch" },
    { title: "Trip Created", description: "Trip order registered.", date: "2026-07-08 14:00", type: "creation" }
  ]
};
export default MOCK_TRIP_TIMELINE;
