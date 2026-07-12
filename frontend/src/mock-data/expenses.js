export const MOCK_EXPENSES = [
  {
    id: "exp-1",
    vehicle: "Mercedes Sprinter (FL-1278)",
    tripId: "TR-1001",
    type: "Fuel",
    vendor: "Shell Inc, Miami",
    amount: 88.40,
    paymentMethod: "Card",
    invoiceNumber: "INV-EXP-1001",
    date: "2026-07-11",
    status: "Paid",
    remarks: "Refueling invoice log for trip TR-1001."
  },
  {
    id: "exp-2",
    vehicle: "Ford Transit-350 (CA-4521)",
    tripId: "TR-1004",
    type: "Repair",
    vendor: "West Coast Workshop",
    amount: 450.00,
    paymentMethod: "Bank Transfer",
    invoiceNumber: "INV-EXP-1002",
    date: "2026-07-11",
    status: "Paid",
    remarks: "Brake service pad and rotors replacement invoice."
  },
  {
    id: "exp-3",
    vehicle: "Freightliner Cascadia (TX-9082)",
    tripId: "TR-1002",
    type: "Toll",
    vendor: "TX Highway Authority",
    amount: 40.00,
    paymentMethod: "Credit",
    invoiceNumber: "INV-EXP-1003",
    date: "2026-07-12",
    status: "Pending",
    remarks: "Auto-logged highway toll fee charges."
  },
  {
    id: "exp-4",
    vehicle: "Mercedes Sprinter (FL-1278)",
    tripId: "TR-1001",
    type: "Toll",
    vendor: "FL SunPass Tolls",
    amount: 25.00,
    paymentMethod: "UPI",
    invoiceNumber: "INV-EXP-1004",
    date: "2026-07-11",
    status: "Paid",
    remarks: "Electronic toll gate auto-debited."
  },
  {
    id: "exp-5",
    vehicle: "Peterbilt 579 (NV-5092)",
    tripId: "TR-1005",
    type: "Other",
    vendor: "NV Towing & Roadside",
    amount: 320.00,
    paymentMethod: "Card",
    invoiceNumber: "INV-EXP-1005",
    date: "2026-07-05",
    status: "Cancelled",
    remarks: "Disputed towing fee. Claim approved and cancelled."
  }
];
export default MOCK_EXPENSES;
