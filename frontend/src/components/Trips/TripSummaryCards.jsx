import React from "react";
import { FileText, Compass, CheckCircle2, AlertOctagon, Route, Weight, Layers } from "lucide-react";
import KPICard from "../KPICard/KPICard";

export const TripSummaryCards = ({ counts }) => {
  if (!counts) return null;

  const formatNum = (val) => Number(val).toLocaleString();

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "1.25rem",
      marginBottom: "2rem"
    }}>
      <KPICard
        title="Total Trips"
        value={counts.total}
        icon={<Layers size={20} />}
      />
      <KPICard
        title="Active / Draft"
        value={counts.active}
        icon={<FileText size={20} style={{ color: "var(--info)" }} />}
      />
      <KPICard
        title="Dispatched"
        value={counts.dispatched}
        icon={<Compass size={20} style={{ color: "var(--primary)" }} />}
      />
      <KPICard
        title="Completed"
        value={counts.completed}
        icon={<CheckCircle2 size={20} style={{ color: "var(--success)" }} />}
      />
      <KPICard
        title="Cancelled"
        value={counts.cancelled}
        icon={<AlertOctagon size={20} style={{ color: "var(--danger)" }} />}
      />
      <KPICard
        title="Total Distance"
        value={`${formatNum(counts.totalDistance)} mi`}
        icon={<Route size={20} style={{ color: "var(--warning)" }} />}
      />
      <KPICard
        title="Total Payload"
        value={`${formatNum(counts.totalCargo)} lbs`}
        icon={<Weight size={20} style={{ color: "var(--primary)" }} />}
      />
    </div>
  );
};

export default TripSummaryCards;
