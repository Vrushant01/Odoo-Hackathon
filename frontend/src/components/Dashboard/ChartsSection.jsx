import React, { useState } from "react";
import { BarChart2, PieChart, TrendingUp, DollarSign } from "lucide-react";
import Card from "../Card/Card";
import Chart from "../Chart/Chart";

export const ChartsSection = ({ chartsData }) => {
  const [activeTab, setActiveTab] = useState("efficiency"); // 'efficiency' | 'operations' | 'finances'

  if (!chartsData) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <Card title="Analytics Loading..."><div style={{ height: "300px" }} /></Card>
        <Card title="Analytics Loading..."><div style={{ height: "300px" }} /></Card>
      </div>
    );
  }

  const {
    fleetUtilization,
    tripsPerDay,
    fuelConsumption,
    monthlyExpenses,
    vehicleUsage,
    driverPerformance,
    tripCompletionRate,
    vehicleROI
  } = chartsData;

  const tabs = [
    { id: "efficiency", label: "Fleet Efficiency", icon: <TrendingUp size={16} /> },
    { id: "operations", label: "Operations Log", icon: <BarChart2 size={16} /> },
    { id: "finances", label: "Finances & ROI", icon: <DollarSign size={16} /> }
  ];

  return (
    <div style={{ marginBottom: "2rem" }}>
      {/* Visual Chart Category Toggles */}
      <div className="glass-panel" style={{
        display: "inline-flex",
        padding: "0.25rem",
        borderRadius: "var(--radius-md)",
        marginBottom: "1.5rem",
        gap: "0.25rem"
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              border: "none",
              background: activeTab === tab.id ? "var(--primary)" : "transparent",
              color: activeTab === tab.id ? "var(--text-inverse)" : "var(--text-secondary)",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.85rem",
              transition: "all var(--transition-fast)"
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chart Grids */}
      {activeTab === "efficiency" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "1.5rem" }}>
          <Card title="Fleet Utilization Trend" subtitle="Weekly active percentage log">
            <Chart
              type="area"
              data={fleetUtilization}
              xKey="name"
              series={[{ key: "utilization", name: "Utilization %", color: "var(--primary)" }]}
              height={300}
            />
          </Card>
          <Card title="Fuel Efficiency Trends" subtitle="Monthly fuel usage vs efficiency ratios">
            <Chart
              type="line"
              data={fuelConsumption}
              xKey="month"
              series={[
                { key: "consumption", name: "Fuel Used (L)", color: "var(--warning)" },
                { key: "averageEfficiency", name: "Efficiency (mpg)", color: "var(--success)" }
              ]}
              height={300}
            />
          </Card>
        </div>
      )}

      {activeTab === "operations" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "1.5rem" }}>
          <Card title="Daily Trip Dispatches" subtitle="Completed vs pending bookings">
            <Chart
              type="bar"
              data={tripsPerDay}
              xKey="day"
              series={[
                { key: "completed", name: "Completed", color: "var(--success)" },
                { key: "pending", name: "Pending / Active", color: "var(--primary)" }
              ]}
              height={300}
            />
          </Card>
          <Card title="Trip Dispatch Completion Rates" subtitle="Share of trip outcomes">
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Chart
                type="pie"
                data={tripCompletionRate}
                height={300}
              />
            </div>
          </Card>
        </div>
      )}

      {activeTab === "finances" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "1.5rem" }}>
          <Card title="Monthly Operational Costs" subtitle="Breakdown of fuel, parts, and maintenance">
            <Chart
              type="bar"
              data={monthlyExpenses}
              xKey="month"
              series={[
                { key: "fuel", name: "Fuel Invoices", color: "var(--primary)" },
                { key: "maintenance", name: "Maintenance Fees", color: "var(--warning)" },
                { key: "other", name: "Operational Misc", color: "var(--text-muted)" }
              ]}
              height={300}
            />
          </Card>
          <Card title="Vehicle Capital ROI" subtitle="Earnings vs expenses ratio per vehicle plate">
            <Chart
              type="line"
              data={vehicleROI}
              xKey="plate"
              series={[
                { key: "roi", name: "Return %", color: "var(--success)" }
              ]}
              height={300}
            />
          </Card>
        </div>
      )}
    </div>
  );
};

export default ChartsSection;
