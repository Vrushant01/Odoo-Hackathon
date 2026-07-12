import React from "react";
import Card from "../Card/Card";
import Chart from "../Chart/Chart";
import AnalyticsTable from "./AnalyticsTable";

export const FleetAnalytics = ({ data, onExport }) => {
  if (!data) return null;

  const {
    summary,
    vehicleStatusDistribution,
    vehicleTypeDistribution,
    utilizationTrend,
    vehicleAvailability,
    downtimeByVehicle,
    mostUsedVehicles,
    leastUsedVehicles,
    vehiclePerformanceTable
  } = data;

  const tableColumns = [
    { key: "vehicle", label: "Vehicle" },
    { key: "trips", label: "Trips", format: "number" },
    { key: "distance", label: "Distance (km)", format: "number" },
    { key: "fuelUsed", label: "Fuel (L)", format: "number" },
    { key: "maintenanceCost", label: "Maint. Cost", format: "currency" },
    { key: "fuelEfficiency", label: "Efficiency (km/L)" },
    { key: "operationalCost", label: "Op. Cost", format: "currency" },
    { key: "roi", label: "ROI (%)", format: "percent" }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Total Vehicles", value: summary.totalVehicles },
          { label: "Active", value: summary.activeVehicles },
          { label: "In Maintenance", value: summary.inMaintenance },
          { label: "Retired", value: summary.retired },
          { label: "Utilization", value: `${summary.fleetUtilization}%` },
          { label: "Total Mileage", value: `${summary.totalMileage.toLocaleString()} km` }
        ].map((item) => (
          <div key={item.label} className="glass-panel" style={{ padding: "0.875rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>{item.label}</span>
            <strong style={{ display: "block", fontSize: "1.15rem", marginTop: "0.125rem" }}>{item.value}</strong>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
        <Card title="Fleet Utilization Trend" subtitle="Monthly fleet utilization percentage">
          <Chart type="area" data={utilizationTrend} xKey="month" series={[{ key: "utilization", name: "Utilization %", color: "var(--primary)" }]} height={240} />
        </Card>
        <Card title="Vehicle Status Distribution" subtitle="Current fleet status breakdown">
          <Chart type="pie" data={vehicleStatusDistribution} height={240} />
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
        <Card title="Vehicle Availability" subtitle="Monthly available vs unavailable">
          <Chart type="bar" data={vehicleAvailability} xKey="month" series={[
            { key: "available", name: "Available", color: "var(--success)" },
            { key: "unavailable", name: "Unavailable", color: "var(--danger)" }
          ]} height={240} />
        </Card>
        <Card title="Vehicle Type Distribution" subtitle="Fleet composition by type">
          <Chart type="pie" data={vehicleTypeDistribution} height={240} />
        </Card>
      </div>

      {/* Downtime Chart */}
      <Card title="Vehicle Downtime (Days)" subtitle="Top vehicles by total downtime days">
        <Chart type="bar" data={downtimeByVehicle} xKey="vehicle" series={[{ key: "downtime", name: "Downtime (days)", color: "var(--warning)" }]} height={220} />
      </Card>

      {/* Highlights */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <Card title="Most Used Vehicles" subtitle="Top performing vehicles by utilization">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {mostUsedVehicles.map((v, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", padding: "0.5rem 0", borderBottom: "1px solid var(--border-color)" }}>
                <span style={{ fontWeight: 600 }}>{v.vehicle}</span>
                <span style={{ color: "var(--success)", fontWeight: 700 }}>{v.utilization}%</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Least Used Vehicles" subtitle="Underutilized fleet units">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {leastUsedVehicles.map((v, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", padding: "0.5rem 0", borderBottom: "1px solid var(--border-color)" }}>
                <span style={{ fontWeight: 600 }}>{v.vehicle}</span>
                <span style={{ color: "var(--danger)", fontWeight: 700 }}>{v.utilization}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Performance Table */}
      <AnalyticsTable
        title="Vehicle Performance Table"
        subtitle="Comprehensive vehicle metrics"
        columns={tableColumns}
        data={vehiclePerformanceTable}
        onExport={() => onExport("csv", "fleet")}
      />
    </div>
  );
};

export default FleetAnalytics;
