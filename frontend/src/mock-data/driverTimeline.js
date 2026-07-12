export const MOCK_DRIVER_TIMELINE = {
  "drv-1": [
    { title: "Trip Started", description: "Dispatched on trip TR-1002 from Houston, TX to Dallas, TX.", date: "2026-07-12", type: "trip" },
    { title: "Assigned Vehicle", description: "Assigned to Freightliner Cascadia (TX-9082).", date: "2026-07-11", type: "assignment" },
    { title: "Safety Award", description: "Received safety recognition for 50 completed safe trips.", date: "2026-06-30", type: "safety" },
    { title: "Driver Registered", description: "Driver registered and Class A CDL verification completed.", date: "2018-03-10", type: "registration" }
  ],
  "drv-2": [
    { title: "Assigned Vehicle", description: "Assigned to Ford Transit-350 (CA-4521).", date: "2022-05-20", type: "assignment" },
    { title: "Driver Registered", description: "Driver registered and Class B CDL verification completed.", date: "2022-05-18", type: "registration" }
  ],
  "drv-3": [
    { title: "Trip Started", description: "Dispatched on trip TR-1003 from New York, NY to Boston, MA.", date: "2026-07-12", type: "trip" },
    { title: "Driver Registered", description: "Driver registered and Class A CDL verification completed.", date: "2014-06-15", type: "registration" }
  ],
  "drv-4": [
    { title: "License Expired", description: "Driving license DL-FL11278 expired. Suspended from active dispatch duty.", date: "2026-06-15", type: "warning" },
    { title: "Driver Registered", description: "Driver registered and Class B CDL verification completed.", date: "2020-11-05", type: "registration" }
  ],
  "drv-5": [
    { title: "Driver Suspended", description: "License status flagged for suspension due to safety violation threshold.", date: "2026-07-05", type: "warning" },
    { title: "Safety Warning", description: "Safety score dropped below threshold (78%).", date: "2026-07-02", type: "warning" },
    { title: "Driver Registered", description: "Driver registered and Class A CDL verification completed.", date: "2016-10-10", type: "registration" }
  ]
};
export default MOCK_DRIVER_TIMELINE;
