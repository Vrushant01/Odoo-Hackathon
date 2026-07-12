import React from "react";
import { Fuel, Award, BarChart3 } from "lucide-react";
import Card from "../Card/Card";
import KPICard from "../KPICard/KPICard";

export const TripFuel = ({ fuel }) => {
  if (!fuel) return null;

  const formatCost = (val) => `$${Number(val).toFixed(2)}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "1.25rem"
      }}>
        <KPICard
          title="Fuel Cost"
          value={formatCost(fuel.fuelCost)}
          icon={<Fuel size={20} />}
        />
        <KPICard
          title="Fuel Consumed"
          value={`${fuel.fuelConsumed} L`}
          icon={<BarChart3 size={20} style={{ color: "var(--primary)" }} />}
        />
        <KPICard
          title="Average Efficiency"
          value={fuel.fuelEfficiency}
          icon={<Award size={20} style={{ color: "var(--success)" }} />}
        />
      </div>
    </div>
  );
};

export default TripFuel;
