import React from "react";
import { DollarSign, Truck, Compass, Navigation } from "lucide-react";
import Card from "../Card/Card";

export const ExpenseSummary = ({ summary }) => {
  if (!summary) return null;

  const {
    totalExpenses = 0,
    fuelExpenses = 0,
    maintenanceExpenses = 0,
    tollExpenses = 0,
    repairExpenses = 0,
    miscExpenses = 0
  } = summary;

  const formatCost = (val) => `$${Number(val).toFixed(2)}`;

  // Calculations for mock km ranges
  const mockDistanceKm = 1500;
  const costPerKm = mockDistanceKm > 0 ? (totalExpenses / mockDistanceKm).toFixed(2) : "0.00";
  const costPerTrip = (totalExpenses / 5).toFixed(2); // Mock 5 trips

  return (
    <Card title="Fleet Operational Cost Audit" subtitle="Aggregated grand totals and cost metrics">
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: "1.5rem" }}>
        
        {/* Left Side: Grand Total & Per Unit KPIs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="glass-panel" style={{ padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 700 }}>GRAND TOTAL COSTS</span>
            <strong style={{ fontSize: "1.6rem", color: "var(--text-primary)", display: "block", marginTop: "0.25rem" }}>
              {formatCost(totalExpenses)}
            </strong>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div className="glass-panel" style={{ padding: "0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "0.65rem", color: "var(--text-secondary)", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <Navigation size={10} /> PER KM COST
              </span>
              <strong style={{ fontSize: "1.0rem", marginTop: "0.125rem", display: "block" }}>
                ${costPerKm}/km
              </strong>
            </div>

            <div className="glass-panel" style={{ padding: "0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
              <span style={{ fontSize: "0.65rem", color: "var(--text-secondary)", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <Compass size={10} /> PER TRIP COST
              </span>
              <strong style={{ fontSize: "1.0rem", marginTop: "0.125rem", display: "block" }}>
                ${costPerTrip}/trip
              </strong>
            </div>
          </div>
        </div>

        {/* Right Side: Ledger Category Breakdown List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignSelf: "center" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
            <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>Fuel Costs</span>
            <strong>{formatCost(fuelExpenses)}</strong>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
            <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>Maintenance Share</span>
            <strong>{formatCost(maintenanceExpenses)}</strong>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
            <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>Tolls & Gateways Fee</span>
            <strong>{formatCost(tollExpenses)}</strong>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
            <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>Repair Workshop Billing</span>
            <strong>{formatCost(repairExpenses)}</strong>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
            <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>Miscellaneous / Fines</span>
            <strong>{formatCost(miscExpenses)}</strong>
          </div>

        </div>

      </div>
    </Card>
  );
};

export default ExpenseSummary;
