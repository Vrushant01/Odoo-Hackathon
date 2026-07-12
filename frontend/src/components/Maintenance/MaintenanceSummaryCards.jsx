import React from "react";
import { Wrench, Calendar, CheckCircle2, AlertOctagon, ShieldAlert, DollarSign } from "lucide-react";
import KPICard from "../KPICard/KPICard";

export const MaintenanceSummaryCards = ({ counts }) => {
  if (!counts) return null;

  const formatCost = (val) => `$${Number(val).toLocaleString()}`;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "1.25rem",
      marginBottom: "2rem"
    }}>
      <KPICard
        title="Total Worksheets"
        value={counts.total}
        icon={<Wrench size={20} />}
      />
      <KPICard
        title="Scheduled"
        value={counts.scheduled}
        icon={<Calendar size={20} style={{ color: "var(--info)" }} />}
      />
      <KPICard
        title="In Workshop"
        value={counts.inWorkshop}
        icon={<Wrench size={20} style={{ color: "var(--warning)" }} />}
      />
      <KPICard
        title="Completed"
        value={counts.completed}
        icon={<CheckCircle2 size={20} style={{ color: "var(--success)" }} />}
      />
      <KPICard
        title="Overdue Tasks"
        value={counts.overdue}
        icon={<ShieldAlert size={20} style={{ color: counts.overdue > 0 ? "var(--danger)" : "var(--success)" }} />}
      />
      <KPICard
        title="Avg Service Cost"
        value={formatCost(counts.avgCost)}
        icon={<DollarSign size={20} style={{ color: "var(--success)" }} />}
      />
    </div>
  );
};

export default MaintenanceSummaryCards;
