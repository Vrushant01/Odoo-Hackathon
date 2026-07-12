import React from "react";
import { Coins, Fuel, Wrench, ShieldCheck, DollarSign, Wallet } from "lucide-react";
import KPICard from "../KPICard/KPICard";

export const ExpenseSummaryCards = ({ counts }) => {
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
        title="Total Ledger"
        value={formatCost(counts.totalExpenses || 0)}
        icon={<Coins size={20} />}
      />
      <KPICard
        title="Fuel Expenses"
        value={formatCost(counts.fuelExpenses || 0)}
        icon={<Fuel size={20} style={{ color: "var(--info)" }} />}
      />
      <KPICard
        title="Tolls Paid"
        value={formatCost(counts.tollExpenses || 0)}
        icon={<ShieldCheck size={20} style={{ color: "var(--primary)" }} />}
      />
      <KPICard
        title="Repairs Paid"
        value={formatCost(counts.repairExpenses || 0)}
        icon={<Wrench size={20} style={{ color: "var(--warning)" }} />}
      />
      <KPICard
        title="Monthly Operations"
        value={formatCost(counts.monthlyExpenses || 0)}
        icon={<Wallet size={20} style={{ color: "var(--success)" }} />}
      />
      <KPICard
        title="Avg Cost Per Trip"
        value={formatCost(counts.avgExpensePerTrip || 0)}
        icon={<DollarSign size={20} style={{ color: "var(--success)" }} />}
      />
    </div>
  );
};

export default ExpenseSummaryCards;
