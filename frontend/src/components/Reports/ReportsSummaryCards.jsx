import React from "react";
import {
  Truck, Users, Route, CheckCircle, Activity, Fuel,
  DollarSign, Gauge, TrendingUp, Wallet, Navigation, Wrench
} from "lucide-react";
import KPICard from "../KPICard/KPICard";

export const ReportsSummaryCards = ({ data }) => {
  if (!data) return null;

  const cards = [
    { title: "Total Vehicles", value: data.totalVehicles, icon: <Truck size={20} />, trend: "neutral" },
    { title: "Total Drivers", value: data.totalDrivers, icon: <Users size={20} />, trend: "neutral" },
    { title: "Total Trips", value: data.totalTrips, icon: <Route size={20} />, trend: "up", change: "+8.2%" },
    { title: "Completed Trips", value: data.completedTrips, icon: <CheckCircle size={20} style={{ color: "var(--success)" }} />, trend: "up", change: "+5.1%" },
    { title: "Fleet Utilization", value: data.fleetUtilization, icon: <Activity size={20} style={{ color: "var(--primary)" }} />, trend: "neutral" },
    { title: "Total Fuel Used", value: data.totalFuelUsed, icon: <Fuel size={20} style={{ color: "var(--warning)" }} />, trend: "up", change: "+3.4%" },
    { title: "Total Operational Cost", value: data.totalOperationalCost, icon: <DollarSign size={20} style={{ color: "var(--danger)" }} />, trend: "up", change: "+6.8%" },
    { title: "Avg Fuel Efficiency", value: data.avgFuelEfficiency, icon: <Gauge size={20} style={{ color: "var(--info)" }} />, trend: "down", change: "-1.2%" },
    { title: "Total Revenue", value: data.totalRevenue, icon: <TrendingUp size={20} style={{ color: "var(--success)" }} />, trend: "up", change: "+12.5%" },
    { title: "Net Profit", value: data.netProfit, icon: <Wallet size={20} style={{ color: "var(--success)" }} />, trend: "up", change: "+9.3%" },
    { title: "Avg Trip Distance", value: data.avgTripDistance, icon: <Navigation size={20} style={{ color: "var(--primary)" }} />, trend: "neutral" },
    { title: "Avg Maintenance Cost", value: data.avgMaintenanceCost, icon: <Wrench size={20} style={{ color: "var(--warning)" }} />, trend: "up", change: "+4.1%" }
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))",
      gap: "1rem",
      marginBottom: "2rem"
    }}>
      {cards.map((card) => (
        <KPICard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          trend={card.trend}
          change={card.change}
        />
      ))}
    </div>
  );
};

export default ReportsSummaryCards;
