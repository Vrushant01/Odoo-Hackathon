import React from "react";
import Card from "../Card/Card";
import Chart from "../Chart/Chart";
import AnalyticsTable from "./AnalyticsTable";

export const FuelAnalytics = ({ data, onExport }) => {
  if (!data) return null;

  const {
    summary = {},
    usageTrend = [],
    costTrend = [],
    efficiencyByVehicle = [],
    consumptionByVehicle = [],
    fuelCostTable = []
  } = data || {};

  const tableColumns = [
    { key: "vehicle", label: "Vehicle" },
    { key: "fuelUsed", label: "Fuel Used (L)", format: "number" },
    { key: "fuelCost", label: "Fuel Cost", format: "currency" },
    { key: "fuelEfficiency", label: "Efficiency (km/L)" },
    { key: "avgCostPerKm", label: "Cost/km", render: (val) => `$${val}` }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Total Fuel Used", value: `${(summary.totalFuelUsed || 0).toLocaleString()} L` },
          { label: "Total Fuel Cost", value: `$${(summary.totalFuelCost || 0).toLocaleString()}` },
          { label: "Avg Efficiency", value: `${summary.avgEfficiency || 0} km/L` },
          { label: "Avg Cost/Liter", value: `$${summary.avgCostPerLiter || 0}` },
          { label: "Avg Cost/km", value: `$${summary.avgCostPerKm || 0}` },
          { label: "Avg Cost/Trip", value: `$${summary.avgCostPerTrip || 0}` }
        ].map((item) => (
          <div key={item.label} className="glass-panel" style={{ padding: "0.875rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>{item.label}</span>
            <strong style={{ display: "block", fontSize: "1.15rem", marginTop: "0.125rem" }}>{item.value}</strong>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
        <Card title="Fuel Usage Trend" subtitle="Monthly consumption volume & cost">
          <Chart type="bar" data={usageTrend} xKey="month" series={[
            { key: "volume", name: "Volume (L)", color: "var(--primary)" },
            { key: "cost", name: "Cost ($)", color: "var(--success)" }
          ]} height={240} />
        </Card>
        <Card title="Fuel Price Trend" subtitle="Average price per liter">
          <Chart type="line" data={costTrend} xKey="month" series={[{ key: "pricePerLiter", name: "$/Liter", color: "var(--warning)" }]} height={240} />
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
        <Card title="Fuel Efficiency by Vehicle" subtitle="km/L comparison across fleet">
          <Chart type="bar" data={efficiencyByVehicle} xKey="vehicle" series={[{ key: "efficiency", name: "Efficiency (km/L)", color: "var(--primary)" }]} height={240} />
        </Card>
        <Card title="Consumption by Vehicle" subtitle="Liters consumed & cost per vehicle">
          <Chart type="bar" data={consumptionByVehicle} xKey="vehicle" series={[
            { key: "consumed", name: "Consumed (L)", color: "var(--info)" },
            { key: "cost", name: "Cost ($)", color: "var(--danger)" }
          ]} height={240} />
        </Card>
      </div>

      {/* Fuel Cost Table */}
      <AnalyticsTable
        title="Fuel Cost Table"
        subtitle="Per-vehicle fuel metrics"
        columns={tableColumns}
        data={fuelCostTable}
        onExport={() => onExport("csv", "fuel")}
      />
    </div>
  );
};

export default FuelAnalytics;
