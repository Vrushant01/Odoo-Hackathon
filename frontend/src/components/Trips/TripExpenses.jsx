import React from "react";
import { Wallet, DollarSign } from "lucide-react";
import Card from "../Card/Card";

export const TripExpenses = ({ expenses }) => {
  if (!expenses) return null;

  const { fuel = 0, maintenance = 0, tolls = 0, other = 0, totalCost = 0 } = expenses;

  // Percentage calculations
  const fuelPercentage = totalCost > 0 ? (fuel / totalCost) * 100 : 0;
  const maintenancePercentage = totalCost > 0 ? (maintenance / totalCost) * 100 : 0;
  const tollsPercentage = totalCost > 0 ? (tolls / totalCost) * 100 : 0;
  const otherPercentage = totalCost > 0 ? (other / totalCost) * 100 : 0;

  const formatCost = (val) => `$${Number(val).toFixed(2)}`;

  return (
    <Card
      title="Trip Operational Budget"
      subtitle="Operational cost allocation for this dispatch"
      headerAction={<Wallet size={18} style={{ color: "var(--success)" }} />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "0.5rem" }}>
        {/* Total Cost */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-secondary)", fontWeight: 600 }}>
            Total Trip Cost
          </span>
          <strong style={{ fontSize: "1.6rem", color: "var(--text-primary)" }}>
            {formatCost(totalCost)}
          </strong>
        </div>

        {/* Stacked Cost Visualizer */}
        <div style={{
          height: "10px",
          backgroundColor: "var(--bg-tertiary)",
          borderRadius: "var(--radius-full)",
          overflow: "hidden",
          display: "flex",
          width: "100%",
          margin: "0.25rem 0"
        }}>
          <div style={{ width: `${fuelPercentage}%`, backgroundColor: "var(--primary)", height: "100%" }} title={`Fuel: ${fuelPercentage.toFixed(0)}%`} />
          <div style={{ width: `${tollsPercentage}%`, backgroundColor: "var(--warning)", height: "100%" }} title={`Tolls: ${tollsPercentage.toFixed(0)}%`} />
          <div style={{ width: `${maintenancePercentage}%`, backgroundColor: "var(--danger)", height: "100%" }} title={`Maintenance: ${maintenancePercentage.toFixed(0)}%`} />
          <div style={{ width: `${otherPercentage}%`, backgroundColor: "var(--text-muted)", height: "100%" }} title={`Other: ${otherPercentage.toFixed(0)}%`} />
        </div>

        {/* Individual Breakdown List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {/* Fuel */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--primary)" }} />
              <span style={{ color: "var(--text-secondary)" }}>Fuel Cost</span>
            </div>
            <strong style={{ color: "var(--text-primary)" }}>{formatCost(fuel)}</strong>
          </div>

          {/* Tolls */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--warning)" }} />
              <span style={{ color: "var(--text-secondary)" }}>Tolls & Gateways</span>
            </div>
            <strong style={{ color: "var(--text-primary)" }}>{formatCost(tolls)}</strong>
          </div>

          {/* Maintenance */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--danger)" }} />
              <span style={{ color: "var(--text-secondary)" }}>Maintenance Share</span>
            </div>
            <strong style={{ color: "var(--text-primary)" }}>{formatCost(maintenance)}</strong>
          </div>

          {/* Other */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--text-muted)" }} />
              <span style={{ color: "var(--text-secondary)" }}>Other Expenses</span>
            </div>
            <strong style={{ color: "var(--text-primary)" }}>{formatCost(other)}</strong>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TripExpenses;
