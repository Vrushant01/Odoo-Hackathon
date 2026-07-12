import React from "react";
import Card from "../Card/Card";
import Chart from "../Chart/Chart";
import AnalyticsTable from "./AnalyticsTable";

export const ProfitabilityAnalytics = ({ data, onExport }) => {
  if (!data) return null;

  const {
    summary = {},
    monthlyProfitTrend = [],
    revenueVsCost = [],
    costBreakdown = [],
    vehicleProfitability = [],
    monthlyPnL = []
  } = data || {};

  const vehicleColumns = [
    { key: "vehicle", label: "Vehicle" },
    { key: "revenue", label: "Revenue", format: "currency" },
    { key: "cost", label: "Cost", format: "currency" },
    { key: "profit", label: "Net Profit", format: "currency" },
    { key: "roi", label: "ROI (%)", format: "percent" }
  ];

  const pnlColumns = [
    { key: "month", label: "Month" },
    { key: "revenue", label: "Revenue", format: "currency" },
    { key: "fuel", label: "Fuel", format: "currency" },
    { key: "maintenance", label: "Maintenance", format: "currency" },
    { key: "tolls", label: "Tolls", format: "currency" },
    { key: "totalCost", label: "Total Cost", format: "currency" },
    { key: "netProfit", label: "Net Profit", format: "currency" },
    { key: "margin", label: "Margin (%)", format: "percent" }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
        {[
          { label: "Total Revenue", value: `$${(summary.totalRevenue || 0).toLocaleString()}` },
          { label: "Total Expenses", value: `$${(summary.totalExpenses || 0).toLocaleString()}` },
          { label: "Net Profit", value: `$${(summary.netProfit || 0).toLocaleString()}` },
          { label: "ROI", value: `${summary.roi || 0}%` },
          { label: "Profit Margin", value: `${summary.profitMargin || 0}%` },
          { label: "Revenue/Trip", value: `$${(summary.revenuePerTrip || 0).toLocaleString()}` },
          { label: "Cost/Vehicle", value: `$${(summary.costPerVehicle || 0).toLocaleString()}` },
          { label: "Cost/Trip", value: `$${summary.costPerTrip || 0}` }
        ].map((item) => (
          <div key={item.label} className="glass-panel" style={{ padding: "0.875rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>{item.label}</span>
            <strong style={{ display: "block", fontSize: "1.15rem", marginTop: "0.125rem" }}>{item.value}</strong>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
        <Card title="Revenue vs Cost" subtitle="Monthly revenue and cost comparison">
          <Chart type="bar" data={revenueVsCost} xKey="month" series={[
            { key: "revenue", name: "Revenue", color: "var(--success)" },
            { key: "cost", name: "Cost", color: "var(--danger)" }
          ]} height={260} />
        </Card>
        <Card title="Cost Breakdown" subtitle="Expense category share of total costs">
          <Chart type="pie" data={costBreakdown} height={260} />
        </Card>
      </div>

      <Card title="Monthly Profit Trend" subtitle="Revenue, expenses, and net profit over time">
        <Chart type="area" data={monthlyProfitTrend} xKey="month" series={[
          { key: "revenue", name: "Revenue", color: "var(--success)" },
          { key: "expenses", name: "Expenses", color: "var(--danger)" },
          { key: "profit", name: "Profit", color: "var(--primary)" }
        ]} height={280} />
      </Card>

      {/* Vehicle Profitability */}
      <AnalyticsTable
        title="Vehicle Profitability"
        subtitle="Revenue, cost, profit, and ROI per vehicle"
        columns={vehicleColumns}
        data={vehicleProfitability}
        onExport={() => onExport("csv", "profitability")}
      />

      {/* P&L Table */}
      <AnalyticsTable
        title="Monthly P&L Statement"
        subtitle="Detailed profit & loss breakdown"
        columns={pnlColumns}
        data={monthlyPnL}
        pageSize={6}
        onExport={() => onExport("csv", "pnl")}
      />
    </div>
  );
};

export default ProfitabilityAnalytics;
