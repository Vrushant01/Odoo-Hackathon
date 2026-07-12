import React from "react";
import Card from "../Card/Card";
import Chart from "../Chart/Chart";
import AnalyticsTable from "./AnalyticsTable";

export const DriverAnalytics = ({ data, onExport }) => {
  if (!data) return null;

  const {
    summary = {},
    performanceRankings = [],
    utilizationTrend = [],
    safetyScoreDistribution = [],
    tripsPerDriver = [],
    licenseExpirySummary = [],
    mostActiveDriver = null,
    leastActiveDriver = null
  } = data || {};

  const tableColumns = [
    { key: "driver", label: "Driver" },
    { key: "completedTrips", label: "Completed", format: "number" },
    { key: "cancelledTrips", label: "Cancelled", format: "number" },
    { key: "distance", label: "Distance (km)", format: "number" },
    { key: "safetyScore", label: "Safety Score" },
    { key: "fuelEfficiency", label: "Efficiency (km/L)" },
    { key: "avgRating", label: "Avg Rating" }
  ];

  const mostActive = mostActiveDriver || { name: "N/A", trips: 0, distance: 0, safetyScore: "N/A" };
  const leastActive = leastActiveDriver || { name: "N/A", trips: 0, distance: 0, safetyScore: "N/A" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Total Drivers", value: summary.totalDrivers },
          { label: "Active", value: summary.activeDrivers },
          { label: "Suspended", value: summary.suspendedDrivers },
          { label: "Avg Safety Score", value: summary.avgSafetyScore },
          { label: "Avg Trips/Driver", value: summary.avgTripsPerDriver },
          { label: "Licenses Expiring", value: summary.licensesExpiringSoon }
        ].map((item) => (
          <div key={item.label} className="glass-panel" style={{ padding: "0.875rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>{item.label}</span>
            <strong style={{ display: "block", fontSize: "1.15rem", marginTop: "0.125rem" }}>{item.value}</strong>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
        <Card title="Driver Utilization Trend" subtitle="Monthly driver utilization rate">
          <Chart type="area" data={utilizationTrend} xKey="month" series={[{ key: "utilization", name: "Utilization %", color: "var(--primary)" }]} height={240} />
        </Card>
        <Card title="Safety Score Distribution" subtitle="Driver count by safety score range">
          <Chart type="pie" data={safetyScoreDistribution.map(d => ({ ...d, value: d.count, name: d.range }))} height={240} />
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
        <Card title="Trips Per Driver" subtitle="Completed trip count comparison">
          <Chart type="bar" data={tripsPerDriver} xKey="driver" series={[{ key: "trips", name: "Trips", color: "var(--primary)" }]} height={240} />
        </Card>
        <Card title="License Expiry Summary" subtitle="Driver license status overview">
          <Chart type="pie" data={licenseExpirySummary.map(d => ({ ...d, value: d.count, name: d.status }))} height={240} />
        </Card>
      </div>

      {/* Highlights */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <Card title="Most Active Driver" subtitle="Highest trip count">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.9rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-secondary)" }}>Name</span><strong>{mostActive.name}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-secondary)" }}>Trips</span><strong>{mostActive.trips}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-secondary)" }}>Distance</span><strong>{(mostActive.distance || 0).toLocaleString()} km</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-secondary)" }}>Safety</span><strong style={{ color: "var(--success)" }}>{mostActive.safetyScore}</strong></div>
          </div>
        </Card>
        <Card title="Least Active Driver" subtitle="Lowest trip count">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.9rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-secondary)" }}>Name</span><strong>{leastActive.name}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-secondary)" }}>Trips</span><strong>{leastActive.trips}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-secondary)" }}>Distance</span><strong>{(leastActive.distance || 0).toLocaleString()} km</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--text-secondary)" }}>Safety</span><strong style={{ color: "var(--warning)" }}>{leastActive.safetyScore}</strong></div>
          </div>
        </Card>
      </div>

      {/* Performance Table */}
      <AnalyticsTable
        title="Driver Performance Table"
        subtitle="Comprehensive driver metrics and rankings"
        columns={tableColumns}
        data={performanceRankings}
        onExport={() => onExport("csv", "driver")}
      />
    </div>
  );
};

export default DriverAnalytics;
