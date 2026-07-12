import React from "react";
import Card from "../Card/Card";

export const TripExpenses = ({ tripBreakdown }) => {
  if (!tripBreakdown) return null;

  const { fuel = 0, maintenance = 0, tolls = 0, other = 0, total = 0 } = tripBreakdown;

  const formatCost = (val) => `$${Number(val).toFixed(2)}`;

  return (
    <Card title="Trip Cost Allocations" subtitle="Expenses associated to this trip run">
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>Fuel Allocation</span>
          <strong>{formatCost(fuel)}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>Maintenance Share</span>
          <strong>{formatCost(maintenance)}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>Tolls & Gates</span>
          <strong>{formatCost(tolls)}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.5rem" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>Miscellaneous / Parking</span>
          <strong>{formatCost(other)}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.25rem" }}>
          <strong style={{ fontSize: "0.95rem" }}>Total Associated Cost</strong>
          <strong style={{ color: "var(--success)", fontSize: "1.1rem" }}>{formatCost(total)}</strong>
        </div>
      </div>
    </Card>
  );
};

export default TripExpenses;
