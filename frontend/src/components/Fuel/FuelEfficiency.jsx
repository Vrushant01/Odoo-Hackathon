import React from "react";
import { Route, Fuel, TrendingUp, AlertCircle } from "lucide-react";
import Card from "../Card/Card";

export const FuelEfficiency = ({ efficiency }) => {
  if (!efficiency) return null;

  const { distanceTravelled = 0, fuelConsumed = 0, distancePerLiter = "N/A", fuelCostPerKilometer = "N/A" } = efficiency;

  return (
    <Card title="Fuel Efficiency Audit" subtitle="Refueling and mileage performance calculations">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.25rem" }}>
        
        {/* Distance */}
        <div className="glass-panel" style={{ padding: "1rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <Route size={12} /> MILEAGE LOGGED
          </span>
          <strong style={{ fontSize: "1.25rem", color: "var(--text-primary)", marginTop: "0.25rem", display: "block" }}>
            {distanceTravelled} mi
          </strong>
        </div>

        {/* Consumed */}
        <div className="glass-panel" style={{ padding: "1rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <Fuel size={12} /> VOLUME CONSUMED
          </span>
          <strong style={{ fontSize: "1.25rem", color: "var(--text-primary)", marginTop: "0.25rem", display: "block" }}>
            {fuelConsumed} L
          </strong>
        </div>

        {/* Distance/L */}
        <div className="glass-panel" style={{ padding: "1rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <TrendingUp size={12} /> EFFICIENCY RATE
          </span>
          <strong style={{ fontSize: "1.25rem", color: "var(--primary)", marginTop: "0.25rem", display: "block" }}>
            {distancePerLiter}
          </strong>
        </div>

        {/* Cost/km */}
        <div className="glass-panel" style={{ padding: "1rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem" }}>
            COST PER KM
          </span>
          <strong style={{ fontSize: "1.25rem", color: "var(--success)", marginTop: "0.25rem", display: "block" }}>
            {fuelCostPerKilometer}
          </strong>
        </div>

      </div>
    </Card>
  );
};

export default FuelEfficiency;
