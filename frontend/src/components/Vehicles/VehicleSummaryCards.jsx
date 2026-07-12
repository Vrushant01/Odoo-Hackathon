import React from "react";
import { Truck, CheckCircle2, Compass, Wrench, AlertOctagon } from "lucide-react";
import KPICard from "../KPICard/KPICard";

export const VehicleSummaryCards = ({ counts }) => {
  if (!counts) return null;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "1.25rem",
      marginBottom: "2rem"
    }}>
      <KPICard
        title="Total Fleet"
        value={counts.total}
        icon={<Truck size={20} />}
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
        title="In Shop"
        value={counts.maintenance}
        icon={<Wrench size={20} style={{ color: "var(--warning)" }} />}
      />
      <KPICard
        title="Retired"
        value={counts.retired}
        icon={<AlertOctagon size={20} style={{ color: "var(--danger)" }} />}
      />
    </div>
  );
};

export default VehicleSummaryCards;
