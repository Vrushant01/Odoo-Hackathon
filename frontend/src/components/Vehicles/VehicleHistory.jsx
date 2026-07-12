import React from "react";
import { TrendingUp, Compass, Wrench, Fuel, DollarSign, Activity } from "lucide-react";
import KPICard from "../KPICard/KPICard";

export const VehicleHistory = ({ history }) => {
  if (!history) return null;

  const formatCost = (val) => `$${Number(val).toLocaleString()}`;
  const formatROI = (val) => `${Number(val).toFixed(1)}%`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* 4 grid financial metrics */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1.25rem"
      }}>
        <KPICard
          title="Revenue Generated"
          value={formatCost(history.revenue)}
          icon={<DollarSign size={20} />}
          trend="up"
        />
        <KPICard
          title="Accumulated Costs"
          value={formatCost(history.expenses)}
          icon={<DollarSign size={20} />}
          trend="down"
        />
        <KPICard
          title="Return on Investment"
          value={formatROI(history.roi)}
          icon={<TrendingUp size={20} style={{ color: "var(--success)" }} />}
          change="Capital Recouped"
          trend="up"
        />
        <KPICard
          title="Total Dispatches"
          value={history.totalTrips}
          icon={<Compass size={20} />}
        />
      </div>

      {/* Operational details card */}
      <div className="glass-panel" style={{
        padding: "1.25rem 1.5rem",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-color)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "1.5rem"
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>COMPLETED TRIPS</span>
          <strong style={{ fontSize: "1.25rem", color: "var(--success)" }}>{history.completedTrips}</strong>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>CANCELLED TRIPS</span>
          <strong style={{ fontSize: "1.25rem", color: "var(--danger)" }}>{history.cancelledTrips}</strong>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>MAINTENANCE LOGS</span>
          <strong style={{ fontSize: "1.25rem" }}>{history.maintenanceCount} Records</strong>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>FUEL INVOICES</span>
          <strong style={{ fontSize: "1.25rem" }}>{history.fuelLogsCount} Logs</strong>
        </div>
      </div>
    </div>
  );
};

export default VehicleHistory;
