import React from "react";
import { Fuel, Calendar, Landmark, Coins, TrendingUp, Compass } from "lucide-react";
import KPICard from "../KPICard/KPICard";

export const FuelSummaryCards = ({ counts }) => {
  if (!counts) return null;

  const formatCost = (val) => `$${Number(val).toLocaleString()}`;
  const formatLiters = (val) => `${Number(val).toLocaleString()} L`;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "1.25rem",
      marginBottom: "2rem"
    }}>
      <KPICard
        title="Total Logs"
        value={counts.totalEntries || 0}
        icon={<Fuel size={20} />}
      />
      <KPICard
        title="Monthly Usage"
        value={formatLiters(counts.monthlyFuel || 0)}
        icon={<Calendar size={20} style={{ color: "var(--info)" }} />}
      />
      <KPICard
        title="Total Refuel Costs"
        value={formatCost(counts.totalFuelCost || 0)}
        icon={<Coins size={20} style={{ color: "var(--success)" }} />}
      />
      <KPICard
        title="Avg Fuel Efficiency"
        value={counts.avgFuelEfficiency || "0.0 mpg"}
        icon={<TrendingUp size={20} style={{ color: "var(--primary)" }} />}
      />
      <KPICard
        title="Avg Refuel Price"
        value={`$${Number(counts.avgFuelPrice || 0).toFixed(2)}/L`}
        icon={<Coins size={20} style={{ color: "var(--warning)" }} />}
      />
      <KPICard
        title="Highest User"
        value={counts.highestConsumptionVehicle || "None"}
        icon={<Compass size={20} style={{ color: "var(--danger)" }} />}
      />
    </div>
  );
};

export default FuelSummaryCards;
