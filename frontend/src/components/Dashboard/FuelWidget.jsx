import React from "react";
import { Fuel, TrendingUp, TrendingDown } from "lucide-react";
import Card from "../Card/Card";

export const FuelWidget = ({ fuel }) => {
  if (!fuel) return null;

  return (
    <Card
      title="Fuel Operations"
      subtitle="Fleet refueling and efficiency metrics"
      headerAction={<Fuel size={18} style={{ color: "var(--primary)" }} />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "0.5rem" }}>
        {/* Cost & Volume */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-secondary)", fontWeight: 600 }}>
              Total Fuel Cost
            </span>
            <strong style={{ fontSize: "1.35rem", color: "var(--text-primary)" }}>{fuel.totalCost}</strong>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-secondary)", fontWeight: 600 }}>
              Average Efficiency
            </span>
            <strong style={{ fontSize: "1.35rem", color: "var(--text-primary)" }}>{fuel.averageEfficiency}</strong>
          </div>
        </div>

        {/* Total Volume */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", padding: "0.75rem", background: "var(--bg-primary)", borderRadius: "var(--radius-sm)" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Total fuel volume refueled:</span>
          <strong style={{ fontSize: "1rem" }}>{fuel.totalFuelUsed}</strong>
        </div>

        {/* Highest and Lowest Consumers */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
          {/* Most consuming */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
            <TrendingUp size={16} style={{ color: "var(--danger)", marginTop: "0.125rem" }} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>Highest Consumer</span>
              <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>{fuel.mostConsuming.vehicle}</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {fuel.mostConsuming.consumption} at {fuel.mostConsuming.efficiency}
              </span>
            </div>
          </div>

          {/* Least consuming */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
            <TrendingDown size={16} style={{ color: "var(--success)", marginTop: "0.125rem" }} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>Most Efficient</span>
              <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>{fuel.leastConsuming.vehicle}</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {fuel.leastConsuming.consumption} at {fuel.leastConsuming.efficiency}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FuelWidget;
