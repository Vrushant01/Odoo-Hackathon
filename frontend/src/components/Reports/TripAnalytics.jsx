import React from "react";
import Card from "../Card/Card";
import Chart from "../Chart/Chart";

export const TripAnalytics = ({ data }) => {
  if (!data) return null;

  const {
    summary = {},
    tripsPerMonth = [],
    tripsPerWeek = [],
    tripsPerDay = [],
    tripStatusDistribution = [],
    distanceDistribution = [],
    cargoWeightTrend = [],
    durationDistribution = []
  } = data || {};

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Total Trips", value: summary.totalTrips },
          { label: "Completed", value: summary.completedTrips },
          { label: "In Progress", value: summary.inProgressTrips },
          { label: "Cancelled", value: summary.cancelledTrips },
          { label: "Completion Rate", value: `${summary.completionRate}%` },
          { label: "Cancellation Rate", value: `${summary.cancellationRate}%` },
          { label: "Avg Distance", value: `${summary.avgDistance} km` },
          { label: "Avg Duration", value: `${summary.avgDuration} hrs` }
        ].map((item) => (
          <div key={item.label} className="glass-panel" style={{ padding: "0.875rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>{item.label}</span>
            <strong style={{ display: "block", fontSize: "1.15rem", marginTop: "0.125rem" }}>{item.value}</strong>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
        <Card title="Trips Per Month" subtitle="Monthly trip volume with completion/cancellation breakdown">
          <Chart type="bar" data={tripsPerMonth} xKey="month" series={[
            { key: "completed", name: "Completed", color: "var(--success)" },
            { key: "cancelled", name: "Cancelled", color: "var(--danger)" }
          ]} height={240} />
        </Card>
        <Card title="Trip Status Distribution" subtitle="Current status breakdown">
          <Chart type="pie" data={tripStatusDistribution} height={240} />
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
        <Card title="Trips Per Day" subtitle="Weekly day distribution">
          <Chart type="bar" data={tripsPerDay} xKey="day" series={[{ key: "trips", name: "Trips", color: "var(--primary)" }]} height={220} />
        </Card>
        <Card title="Trips Per Week" subtitle="Weekly trip volume">
          <Chart type="bar" data={tripsPerWeek} xKey="week" series={[{ key: "trips", name: "Trips", color: "var(--info)" }]} height={220} />
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
        <Card title="Distance Distribution" subtitle="Trip distance range breakdown">
          <Chart type="bar" data={distanceDistribution} xKey="range" series={[{ key: "count", name: "Trips", color: "var(--primary)" }]} height={220} />
        </Card>
        <Card title="Avg Cargo Weight Trend" subtitle="Monthly average cargo weight (tons)">
          <Chart type="line" data={cargoWeightTrend} xKey="month" series={[{ key: "avgWeight", name: "Avg Weight (t)", color: "var(--warning)" }]} height={220} />
        </Card>
      </div>

      <Card title="Trip Duration Distribution" subtitle="Duration range breakdown">
        <Chart type="bar" data={durationDistribution} xKey="range" series={[{ key: "count", name: "Trips", color: "var(--success)" }]} height={220} />
      </Card>
    </div>
  );
};

export default TripAnalytics;
