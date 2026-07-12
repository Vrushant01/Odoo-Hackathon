export const MOCK_TRIP_STATISTICS = {
  "TR-1001": { distance: 235, cargoDelivered: 1200, averageSpeed: "58 mph", duration: "4.0 hrs", completionRate: 100 },
  "TR-1002": { distance: 120, cargoDelivered: 42000, averageSpeed: "52 mph", duration: "2.3 hrs", completionRate: 50 }, // Dispatched (halfway)
  "TR-1003": { distance: 80, cargoDelivered: 28000, averageSpeed: "48 mph", duration: "1.7 hrs", completionRate: 37 }, // Dispatched
  "TR-1004": { distance: 0, cargoDelivered: 0, averageSpeed: "0 mph", duration: "0 hrs", completionRate: 0 }, // Draft
  "TR-1005": { distance: 0, cargoDelivered: 0, averageSpeed: "0 mph", duration: "0 hrs", completionRate: 0 }, // Cancelled
  "TR-1006": { distance: 95, cargoDelivered: 14000, averageSpeed: "55 mph", duration: "1.8 hrs", completionRate: 100 }
};
export default MOCK_TRIP_STATISTICS;
