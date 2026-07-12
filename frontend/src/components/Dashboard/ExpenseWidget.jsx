import React from "react";
import { DollarSign, Wallet } from "lucide-react";
import Card from "../Card/Card";

export const ExpenseWidget = ({ expenses }) => {
  if (!expenses) return null;

  const { fuelCost, maintenanceCost, otherExpenses, totalCost } = expenses;

  // Percentage calculations
  const fuelPercentage = totalCost > 0 ? (fuelCost / totalCost) * 100 : 0;
  const maintenancePercentage = totalCost > 0 ? (maintenanceCost / totalCost) * 100 : 0;
  const otherPercentage = totalCost > 0 ? (otherExpenses / totalCost) * 100 : 0;

  const formatCost = (val) => `$${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <Card
      title="Expense Breakdown"
      subtitle="Operational cost allocation"
      headerAction={<Wallet size={18} style={{ color: "var(--success)" }} />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "0.5rem" }}>
        {/* Total Cost Display */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-secondary)", fontWeight: 600 }}>
            Total Operational Budget
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
          <div style={{ width: `${maintenancePercentage}%`, backgroundColor: "var(--warning)", height: "100%" }} title={`Maintenance: ${maintenancePercentage.toFixed(0)}%`} />
          <div style={{ width: `${otherPercentage}%`, backgroundColor: "var(--text-muted)", height: "100%" }} title={`Other: ${otherPercentage.toFixed(0)}%`} />
        </div>

        {/* Individual Breakdown List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {/* Fuel */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--primary)" }} />
              <span style={{ color: "var(--text-secondary)" }}>Fuel Invoices</span>
            </div>
            <strong style={{ color: "var(--text-primary)" }}>{formatCost(fuelCost)}</strong>
          </div>

          {/* Maintenance */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--warning)" }} />
              <span style={{ color: "var(--text-secondary)" }}>Maintenance Logs</span>
            </div>
            <strong style={{ color: "var(--text-primary)" }}>{formatCost(maintenanceCost)}</strong>
          </div>

          {/* Other */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--text-muted)" }} />
              <span style={{ color: "var(--text-secondary)" }}>Other Expenses</span>
            </div>
            <strong style={{ color: "var(--text-primary)" }}>{formatCost(otherExpenses)}</strong>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ExpenseWidget;
