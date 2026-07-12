import React from "react";
import Card from "../Card/Card";
import Chart from "../Chart/Chart";
import AnalyticsTable from "./AnalyticsTable";

export const MaintenanceAnalytics = ({ data, onExport }) => {
  if (!data) return null;

  const {
    summary = {},
    costTrend = [],
    frequencyTrend = [],
    maintenanceTypeDistribution = [],
    repairCountByVehicle = [],
    workshopUtilization = [],
    maintenanceCostTable = []
  } = data || {};

  const tableColumns = [
    { key: "vehicle", label: "Vehicle" },
    { key: "maintenanceCount", label: "Count", format: "number" },
    { key: "totalCost", label: "Total Cost", format: "currency" },
    { key: "avgCost", label: "Avg Cost", format: "currency" },
    { key: "downtime", label: "Downtime (days)", format: "number" }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Total Records", value: summary.totalRecords || 0 },
          { label: "Completed", value: summary.completedMaintenance || 0 },
          { label: "In Progress", value: summary.inProgressMaintenance || 0 },
          { label: "Preventive", value: summary.preventiveCount || 0 },
          { label: "Corrective", value: summary.correctiveCount || 0 },
          { label: "Avg Downtime", value: `${summary.avgDowntimeDays || 0} days` },
          { label: "Total Cost", value: `$${(summary.totalCost || 0).toLocaleString()}` },
          { label: "Avg Cost", value: `$${summary.avgCostPerRecord || 0}` }
        ].map((item) => (
          <div key={item.label} className="glass-panel" style={{ padding: "0.875rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>{item.label}</span>
            <strong style={{ display: "block", fontSize: "1.15rem", marginTop: "0.125rem" }}>{item.value}</strong>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
        <Card title="Maintenance Cost Trend" subtitle="Monthly maintenance spending">
          <Chart type="line" data={costTrend} xKey="month" series={[{ key: "cost", name: "Cost ($)", color: "var(--warning)" }]} height={240} />
        </Card>
        <Card title="Preventive vs Corrective" subtitle="Type distribution breakdown">
          <Chart type="pie" data={maintenanceTypeDistribution} height={240} />
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
        <Card title="Maintenance Frequency" subtitle="Monthly preventive vs corrective counts">
          <Chart type="bar" data={frequencyTrend} xKey="month" series={[
            { key: "preventive", name: "Preventive", color: "var(--success)" },
            { key: "corrective", name: "Corrective", color: "var(--warning)" }
          ]} height={240} />
        </Card>
        <Card title="Repair Count by Vehicle" subtitle="Top vehicles by number of repairs">
          <Chart type="bar" data={repairCountByVehicle} xKey="vehicle" series={[{ key: "repairs", name: "Repairs", color: "var(--danger)" }]} height={240} />
        </Card>
      </div>

      {/* Workshop Utilization */}
      <Card title="Workshop Utilization" subtitle="Capacity usage across maintenance facilities">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginTop: "0.5rem" }}>
          {workshopUtilization.map((ws) => (
            <div key={ws.workshop} className="glass-panel" style={{ padding: "1rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
              <strong style={{ fontSize: "0.9rem" }}>{ws.workshop}</strong>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                <span>{ws.jobs}/{ws.capacity} jobs</span>
                <strong style={{ color: ws.utilization >= 80 ? "var(--warning)" : "var(--success)" }}>{ws.utilization}%</strong>
              </div>
              <div style={{ marginTop: "0.375rem", height: "6px", borderRadius: "3px", backgroundColor: "var(--border-color)", overflow: "hidden" }}>
                <div style={{ width: `${ws.utilization}%`, height: "100%", borderRadius: "3px", backgroundColor: ws.utilization >= 80 ? "var(--warning)" : "var(--success)", transition: "width 0.5s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Cost Table */}
      <AnalyticsTable
        title="Maintenance Cost Table"
        subtitle="Per-vehicle maintenance cost and downtime"
        columns={tableColumns}
        data={maintenanceCostTable}
        onExport={() => onExport("csv", "maintenance")}
      />
    </div>
  );
};

export default MaintenanceAnalytics;
