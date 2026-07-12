export const REPORT_HISTORY = [
  {
    id: "rh-1",
    title: "Monthly Fleet Performance — June 2026",
    type: "Fleet",
    generatedBy: "Sarah Jenkins",
    date: "2026-07-01",
    format: "PDF",
    status: "Ready",
    size: "3.2 MB"
  },
  {
    id: "rh-2",
    title: "Driver Safety Audit — Q2 2026",
    type: "Driver",
    generatedBy: "Marcus Vance",
    date: "2026-06-30",
    format: "Excel",
    status: "Ready",
    size: "2.1 MB"
  },
  {
    id: "rh-3",
    title: "Fuel Efficiency Report — June 2026",
    type: "Fuel",
    generatedBy: "Elena Rostova",
    date: "2026-07-02",
    format: "PDF",
    status: "Ready",
    size: "1.8 MB"
  },
  {
    id: "rh-4",
    title: "Maintenance Cost Forecast — H2 2026",
    type: "Maintenance",
    generatedBy: "Elena Rostova",
    date: "2026-07-05",
    format: "PDF",
    status: "Generating",
    size: "--"
  },
  {
    id: "rh-5",
    title: "Operational Expense Summary — June 2026",
    type: "Expense",
    generatedBy: "Sarah Jenkins",
    date: "2026-07-03",
    format: "CSV",
    status: "Ready",
    size: "890 KB"
  },
  {
    id: "rh-6",
    title: "Trip Volume Analysis — Q2 2026",
    type: "Trip",
    generatedBy: "Marcus Vance",
    date: "2026-06-28",
    format: "PDF",
    status: "Ready",
    size: "2.5 MB"
  },
  {
    id: "rh-7",
    title: "Profitability Report — Q2 2026",
    type: "Profitability",
    generatedBy: "Elena Rostova",
    date: "2026-07-08",
    format: "PDF",
    status: "Ready",
    size: "4.8 MB"
  },
  {
    id: "rh-8",
    title: "Full Operational Report — June 2026",
    type: "Operational",
    generatedBy: "System Admin",
    date: "2026-07-10",
    format: "PDF",
    status: "Ready",
    size: "6.2 MB"
  }
];

export const SCHEDULED_REPORTS = [
  {
    id: "sr-1",
    name: "Weekly Fleet Summary",
    schedule: "Weekly",
    day: "Monday",
    time: "08:00 AM",
    recipients: ["fleet@transitops.com", "manager@transitops.com"],
    format: "PDF",
    enabled: true,
    lastRun: "2026-07-07"
  },
  {
    id: "sr-2",
    name: "Monthly Expense Report",
    schedule: "Monthly",
    day: "1st",
    time: "06:00 AM",
    recipients: ["finance@transitops.com"],
    format: "Excel",
    enabled: true,
    lastRun: "2026-07-01"
  },
  {
    id: "sr-3",
    name: "Daily Driver Activity",
    schedule: "Daily",
    day: "Every Day",
    time: "11:00 PM",
    recipients: ["ops@transitops.com"],
    format: "CSV",
    enabled: false,
    lastRun: "2026-07-11"
  }
];
