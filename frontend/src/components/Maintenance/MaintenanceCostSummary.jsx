import React from "react";
import { Wallet, DollarSign } from "lucide-react";
import Card from "../Card/Card";

export const MaintenanceCostSummary = ({ costSummary }) => {
  if (!costSummary) return null;

  const { estimatedCost = 0, labourCost = 0, partsCost = 0, additionalCharges = 0, finalCost = 0 } = costSummary;

  // Percentage calculations
  const totalCalculated = labourCost + partsCost + additionalCharges;
  const laborPercentage = totalCalculated > 0 ? (labourCost / totalCalculated) * 100 : 0;
  const partsPercentage = totalCalculated > 0 ? (partsCost / totalCalculated) * 100 : 0;
  const chargesPercentage = totalCalculated > 0 ? (additionalCharges / totalCalculated) * 100 : 0;

  const formatCost = (val) => `$${Number(val).toFixed(2)}`;

  return (
    <Card
      title="Servicing Cost Summary"
      subtitle="Workshop charges breakdown"
      headerAction={<Wallet size={18} style={{ color: "var(--success)" }} />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "0.5rem" }}>
        {/* Total Cost Displays */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-secondary)", fontWeight: 600 }}>
              Estimated Budget
            </span>
            <strong style={{ fontSize: "1.35rem", color: "var(--text-secondary)" }}>
              {formatCost(estimatedCost)}
            </strong>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-secondary)", fontWeight: 600 }}>
              Final Servicing Cost
            </span>
            <strong style={{ fontSize: "1.45rem", color: "var(--text-primary)" }}>
              {formatCost(finalCost)}
            </strong>
          </div>
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
          <div style={{ width: `${laborPercentage}%`, backgroundColor: "var(--primary)", height: "100%" }} title={`Labour: ${laborPercentage.toFixed(0)}%`} />
          <div style={{ width: `${partsPercentage}%`, backgroundColor: "var(--warning)", height: "100%" }} title={`Parts: ${partsPercentage.toFixed(0)}%`} />
          <div style={{ width: `${chargesPercentage}%`, backgroundColor: "var(--text-muted)", height: "100%" }} title={`Charges: ${chargesPercentage.toFixed(0)}%`} />
        </div>

        {/* Individual Breakdown List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {/* Labour */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--primary)" }} />
              <span style={{ color: "var(--text-secondary)" }}>Labour Charges</span>
            </div>
            <strong style={{ color: "var(--text-primary)" }}>{formatCost(labourCost)}</strong>
          </div>

          {/* Parts */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--warning)" }} />
              <span style={{ color: "var(--text-secondary)" }}>Spare Parts Cost</span>
            </div>
            <strong style={{ color: "var(--text-primary)" }}>{formatCost(partsCost)}</strong>
          </div>

          {/* Charges */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--text-muted)" }} />
              <span style={{ color: "var(--text-secondary)" }}>Additional Charges / Taxes</span>
            </div>
            <strong style={{ color: "var(--text-primary)" }}>{formatCost(additionalCharges)}</strong>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MaintenanceCostSummary;
