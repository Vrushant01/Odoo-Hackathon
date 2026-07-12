export const MOCK_REPORTS = [
  {
    id: "rep-1",
    title: "Monthly Fuel Efficiency Summary",
    type: "Financial",
    generatedBy: "Elena Rostova",
    date: "2026-07-01",
    format: "PDF",
    status: "Ready",
    size: "2.4 MB"
  },
  {
    id: "rep-2",
    title: "Quarterly Driver Safety Log",
    type: "Safety",
    generatedBy: "Marcus Vance",
    date: "2026-06-30",
    format: "Excel",
    status: "Ready",
    size: "1.8 MB"
  },
  {
    id: "rep-3",
    title: "Fleet Odometer and Utilization Report",
    type: "Operational",
    generatedBy: "Sarah Jenkins",
    date: "2026-07-10",
    format: "PDF",
    status: "Generating",
    size: "--"
  },
  {
    id: "rep-4",
    title: "Maintenance Cost Forecast (H2 2026)",
    type: "Financial",
    generatedBy: "Elena Rostova",
    date: "2026-07-05",
    format: "PDF",
    status: "Ready",
    size: "4.1 MB"
  }
];

export const MOCK_REPORT_METRICS = {
  efficiencyTrends: [
    { month: "Jan", heavyTrucks: 7.0, deliveryVans: 19.5 },
    { month: "Feb", heavyTrucks: 7.1, deliveryVans: 19.8 },
    { month: "Mar", heavyTrucks: 7.2, deliveryVans: 20.1 },
    { month: "Apr", heavyTrucks: 7.0, deliveryVans: 20.5 },
    { month: "May", heavyTrucks: 7.3, deliveryVans: 21.0 },
    { month: "Jun", heavyTrucks: 7.2, deliveryVans: 21.0 }
  ]
};
