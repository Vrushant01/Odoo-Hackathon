import React, { useState } from "react";
import {
  Truck,
  Users,
  Compass,
  DollarSign,
  TrendingUp,
  Activity,
  UserCheck,
  CheckCircle,
  AlertOctagon,
  Wrench,
  Fuel
} from "lucide-react";
import KPICard from "../KPICard/KPICard";

export const KPICards = ({ summary }) => {
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'fleet' | 'crew' | 'financials'

  if (!summary) return null;

  const { vehicles, drivers, trips, financials } = summary;

  // Formatting utilities
  const formatCost = (val) => `$${Number(val).toLocaleString()}`;
  const formatPercentage = (val) => `${Number(val).toFixed(1)}%`;
  const formatLiters = (val) => `${Number(val).toLocaleString()} L`;

  const tabs = [
    { id: "overview", label: "Overview", icon: <Activity size={16} /> },
    { id: "fleet", label: "Fleet Stats", icon: <Truck size={16} /> },
    { id: "crew", label: "Crew Stats", icon: <Users size={16} /> },
    { id: "financials", label: "Finances", icon: <DollarSign size={16} /> }
  ];

  return (
    <div style={{ marginBottom: "2rem" }}>
      {/* Category Tabs */}
      <div className="glass-panel" style={{
        display: "inline-flex",
        padding: "0.25rem",
        borderRadius: "var(--radius-md)",
        marginBottom: "1.5rem",
        gap: "0.25rem"
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              border: "none",
              background: activeTab === tab.id ? "var(--primary)" : "transparent",
              color: activeTab === tab.id ? "var(--text-inverse)" : "var(--text-secondary)",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.85rem",
              transition: "all var(--transition-fast)"
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid rendering based on category */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "1.25rem"
      }}>
        {activeTab === "overview" && (
          <>
            <KPICard
              title="Fleet Utilization"
              value={formatPercentage(financials.utilization)}
              icon={<TrendingUp size={22} />}
              change="Optimal range (75%+)"
              trend="up"
            />
            <KPICard
              title="Active Trips"
              value={trips.active}
              icon={<Compass size={22} />}
              change="Live dispatches"
              trend="neutral"
            />
            <KPICard
              title="Total Revenue"
              value={formatCost(financials.revenue)}
              icon={<DollarSign size={22} />}
              change="Monthly target 80%"
              trend="up"
            />
            <KPICard
              title="Available Vehicles"
              value={vehicles.available}
              icon={<Truck size={22} />}
              change="Ready for scheduling"
              trend="up"
            />
          </>
        )}

        {activeTab === "fleet" && (
          <>
            <KPICard
              title="Total Fleet size"
              value={vehicles.total}
              icon={<Truck size={22} />}
            />
            <KPICard
              title="Available Vehicles"
              value={vehicles.available}
              icon={<Truck size={22} />}
              trend="up"
            />
            <KPICard
              title="Vehicles On Trip"
              value={vehicles.onTrip}
              icon={<Compass size={22} />}
            />
            <KPICard
              title="In Maintenance"
              value={vehicles.maintenance}
              icon={<Wrench size={22} />}
              trend="down"
            />
            <KPICard
              title="Retired Vehicles"
              value={vehicles.retired}
              icon={<AlertOctagon size={22} />}
            />
          </>
        )}

        {activeTab === "crew" && (
          <>
            <KPICard
              title="Total Drivers"
              value={drivers.total}
              icon={<Users size={22} />}
            />
            <KPICard
              title="Drivers On Duty"
              value={drivers.onDuty}
              icon={<UserCheck size={22} />}
              trend="up"
            />
            <KPICard
              title="Drivers Available"
              value={drivers.available}
              icon={<Users size={22} />}
            />
          </>
        )}

        {activeTab === "financials" && (
          <>
            <KPICard
              title="Net Profit"
              value={formatCost(financials.profit)}
              icon={<TrendingUp size={22} />}
              change="+14.2% from June"
              trend="up"
            />
            <KPICard
              title="Total Revenue"
              value={formatCost(financials.revenue)}
              icon={<DollarSign size={22} />}
            />
            <KPICard
              title="Operational Cost"
              value={formatCost(financials.operationalCost)}
              icon={<DollarSign size={22} />}
            />
            <KPICard
              title="Fuel Consumption"
              value={formatLiters(financials.fuelConsumption)}
              icon={<Fuel size={22} />}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default KPICards;
