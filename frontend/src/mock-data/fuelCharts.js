export const MOCK_FUEL_CHARTS = {
  monthlyFuelUsage: [
    { month: "Jan", volume: 980, cost: 1320 },
    { month: "Feb", volume: 1050, cost: 1410 },
    { month: "Mar", volume: 1200, cost: 1620 },
    { month: "Apr", volume: 1150, cost: 1550 },
    { month: "May", volume: 1300, cost: 1750 },
    { month: "Jun", volume: 1250, cost: 1680 },
    { month: "Jul", volume: 1400, cost: 1890 }
  ],
  fuelCostTrend: [
    { date: "07/08", price: 1.25 },
    { date: "07/09", price: 1.34 },
    { date: "07/11", price: 1.36 },
    { date: "07/12", price: 1.40 }
  ],
  fuelEfficiencyTrend: [
    { vehicle: "TX-9082 (Freightliner)", efficiency: 8.0 },
    { vehicle: "NY-8832 (Volvo)", efficiency: 7.8 },
    { vehicle: "FL-1278 (Mercedes)", efficiency: 19.8 },
    { vehicle: "CA-4521 (Ford)", efficiency: 15.2 }
  ]
};
export default MOCK_FUEL_CHARTS;
