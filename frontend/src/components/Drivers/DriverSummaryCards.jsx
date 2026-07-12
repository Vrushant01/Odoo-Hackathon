import React from "react";
import { Users, CheckCircle2, Compass, AlertOctagon, ShieldAlert, Award } from "lucide-react";
import KPICard from "../KPICard/KPICard";

export const DriverSummaryCards = ({ counts }) => {
  if (!counts) return null;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "1.25rem",
      marginBottom: "2rem"
    }}>
      <KPICard
        title="Total Drivers"
        value={counts.total}
        icon={<Users size={20} />}
      />
      <KPICard
        title="Available"
        value={counts.available}
        icon={<CheckCircle2 size={20} style={{ color: "var(--success)" }} />}
      />
      <KPICard
        title="On Trip"
        value={counts.onTrip}
        icon={<Compass size={20} style={{ color: "var(--primary)" }} />}
      />
      <KPICard
        title="Suspended"
        value={counts.suspended}
        icon={<AlertOctagon size={20} style={{ color: "var(--danger)" }} />}
      />
      <KPICard
        title="Expired Licenses"
        value={counts.expiredLicense}
        icon={<ShieldAlert size={20} style={{ color: counts.expiredLicense > 0 ? "var(--danger)" : "var(--success)" }} />}
      />
      <KPICard
        title="Avg Safety Score"
        value={`${counts.averageSafetyScore}%`}
        icon={<Award size={20} style={{ color: "var(--warning)" }} />}
      />
    </div>
  );
};

export default DriverSummaryCards;
