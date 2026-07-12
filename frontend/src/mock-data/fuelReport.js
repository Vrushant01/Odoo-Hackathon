export const FUEL_REPORT = {
  summary: {
    totalFuelUsed: 24850,
    totalFuelCost: 37275,
    avgEfficiency: 3.85,
    avgCostPerLiter: 1.50,
    avgCostPerKm: 0.38,
    avgCostPerTrip: 200.4,
    monthlyAvgConsumption: 4142
  },
  usageTrend: [
    { month: "Jan", volume: 3800, cost: 5700 },
    { month: "Feb", volume: 3600, cost: 5400 },
    { month: "Mar", volume: 4200, cost: 6300 },
    { month: "Apr", volume: 4100, cost: 6150 },
    { month: "May", volume: 4500, cost: 6750 },
    { month: "Jun", volume: 4650, cost: 6975 }
  ],
  costTrend: [
    { month: "Jan", pricePerLiter: 1.42 },
    { month: "Feb", pricePerLiter: 1.45 },
    { month: "Mar", pricePerLiter: 1.48 },
    { month: "Apr", pricePerLiter: 1.50 },
    { month: "May", pricePerLiter: 1.52 },
    { month: "Jun", pricePerLiter: 1.55 }
  ],
  efficiencyByVehicle: [
    { vehicle: "Mercedes Actros (FL-1002)", efficiency: 4.2 },
    { vehicle: "Lisa T. Van (FL-1022)", efficiency: 4.1 },
    { vehicle: "MAN TGX (FL-1005)", efficiency: 4.0 },
    { vehicle: "DAF CF (FL-1018)", efficiency: 4.0 },
    { vehicle: "Volvo FH16 (FL-1001)", efficiency: 3.75 },
    { vehicle: "Scania R500 (FL-1008)", efficiency: 3.70 },
    { vehicle: "DAF XF (FL-1012)", efficiency: 3.65 },
    { vehicle: "Iveco Stralis (FL-1015)", efficiency: 3.33 }
  ],
  consumptionByVehicle: [
    { vehicle: "Mercedes Actros", consumed: 4625, cost: 6938 },
    { vehicle: "Volvo FH16", consumed: 4320, cost: 6480 },
    { vehicle: "MAN TGX", consumed: 3950, cost: 5925 },
    { vehicle: "Scania R500", consumed: 3550, cost: 5325 },
    { vehicle: "DAF XF", consumed: 3070, cost: 4605 },
    { vehicle: "DAF CF", consumed: 1200, cost: 1800 },
    { vehicle: "Renault T", consumed: 1360, cost: 2040 },
    { vehicle: "Iveco Stralis", consumed: 960, cost: 1440 }
  ],
  fuelCostTable: [
    { vehicle: "Mercedes Actros (FL-1002)", fuelUsed: 4625, fuelCost: 6938, fuelEfficiency: 4.0, avgCostPerKm: 0.375 },
    { vehicle: "Volvo FH16 (FL-1001)", fuelUsed: 4320, fuelCost: 6480, fuelEfficiency: 3.75, avgCostPerKm: 0.400 },
    { vehicle: "MAN TGX (FL-1005)", fuelUsed: 3950, fuelCost: 5925, fuelEfficiency: 4.0, avgCostPerKm: 0.375 },
    { vehicle: "Scania R500 (FL-1008)", fuelUsed: 3550, fuelCost: 5325, fuelEfficiency: 4.0, avgCostPerKm: 0.375 },
    { vehicle: "DAF XF (FL-1012)", fuelUsed: 3070, fuelCost: 4605, fuelEfficiency: 3.75, avgCostPerKm: 0.400 },
    { vehicle: "Iveco Stralis (FL-1015)", fuelUsed: 960, fuelCost: 1440, fuelEfficiency: 3.33, avgCostPerKm: 0.450 },
    { vehicle: "DAF CF (FL-1018)", fuelUsed: 1200, fuelCost: 1800, fuelEfficiency: 4.0, avgCostPerKm: 0.375 },
    { vehicle: "Renault T (FL-1020)", fuelUsed: 1360, fuelCost: 2040, fuelEfficiency: 3.75, avgCostPerKm: 0.400 }
  ]
};
