import React from "react";
import Card from "../Card/Card";
import Chart from "../Chart/Chart";
import AnalyticsTable from "./AnalyticsTable";

export const ExpenseAnalytics = ({ data, onExport }) => {
  if (!data) return null;

  const {
    summary = {},
    monthlyExpenses = [],
    categoryDistribution = [],
    vehicleExpenses = [],
    operationalCostTrend = [],
    expenseTable = []
  } = data || {};

  const tableColumns = [
    { key: "category", label: "Category" },
    { key: "amount", label: "Amount", format: "currency" },
    { key: "percentage", label: "Share (%)", format: "percent" },
    { key: "vehicle", label: "Vehicle" },
    { key: "trip", label: "Trip" },
    { key: "date", label: "Date" }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Total Expenses", value: `$${(summary.totalExpenses || 0).toLocaleString()}` },
          { label: "Fuel Expenses", value: `$${(summary.fuelExpenses || 0).toLocaleString()}` },
          { label: "Maintenance", value: `$${(summary.maintenanceExpenses || 0).toLocaleString()}` },
          { label: "Tolls", value: `$${(summary.tollExpenses || 0).toLocaleString()}` },
          { label: "Monthly Avg", value: `$${(summary.monthlyAvg || 0).toLocaleString()}` },
          { label: "Avg Per Trip", value: `$${summary.avgPerTrip || 0}` }
        ].map((item) => (
          <div key={item.label} className="glass-panel" style={{ padding: "0.875rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>{item.label}</span>
            <strong style={{ display: "block", fontSize: "1.15rem", marginTop: "0.125rem" }}>{item.value}</strong>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
        <Card title="Monthly Expense Breakdown" subtitle="Fuel, maintenance, tolls & other">
          <Chart type="bar" data={monthlyExpenses} xKey="month" series={[
            { key: "fuel", name: "Fuel", color: "var(--primary)" },
            { key: "maintenance", name: "Maintenance", color: "var(--warning)" },
            { key: "tolls", name: "Tolls", color: "var(--success)" },
            { key: "other", name: "Other", color: "var(--text-muted)" }
          ]} height={240} />
        </Card>
        <Card title="Expense Category Distribution" subtitle="Cost share breakdown">
          <Chart type="pie" data={categoryDistribution} height={240} />
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
        <Card title="Operational Cost Trend" subtitle="Total monthly operational spending">
          <Chart type="area" data={operationalCostTrend} xKey="month" series={[{ key: "cost", name: "Operational Cost ($)", color: "var(--danger)" }]} height={240} />
        </Card>
        <Card title="Vehicle Expense Comparison" subtitle="Top vehicles by total expenses">
          <Chart type="bar" data={vehicleExpenses.map(v => ({ ...v, name: v.vehicle.split(" (")[0] }))} xKey="name" series={[
            { key: "fuel", name: "Fuel", color: "var(--primary)" },
            { key: "maintenance", name: "Maintenance", color: "var(--warning)" },
            { key: "tolls", name: "Tolls", color: "var(--success)" }
          ]} height={240} />
        </Card>
      </div>

      {/* Expense Table */}
      <AnalyticsTable
        title="Expense Breakdown Table"
        subtitle="Category-level expense summary"
        columns={tableColumns}
        data={expenseTable}
        onExport={() => onExport("csv", "expense")}
      />
    </div>
  );
};

export default ExpenseAnalytics;
