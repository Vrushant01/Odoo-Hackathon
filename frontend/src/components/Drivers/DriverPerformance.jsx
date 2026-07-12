import React from "react";
import { Award, ShieldAlert, Zap, BarChart3, AlertTriangle, AlertCircle, Heart } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import Card from "../Card/Card";
import KPICard from "../KPICard/KPICard";

export const DriverPerformance = ({ performance }) => {
  if (!performance) return null;

  const formatRating = (val) => `${Number(val).toFixed(1)} / 5.0`;

  // Safety Score trend over time mock data
  const trendData = [
    { month: "Jan", score: 98 },
    { month: "Feb", score: 95 },
    { month: "Mar", score: performance.safetyScore - 2 },
    { month: "Apr", score: performance.safetyScore + 1 },
    { month: "May", score: performance.safetyScore - 1 },
    { month: "Jun", score: performance.safetyScore }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* KPI stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1.25rem"
      }}>
        <KPICard
          title="Safety Score"
          value={`${performance.safetyScore}%`}
          icon={<Award size={20} style={{ color: "var(--warning)" }} />}
        />
        <KPICard
          title="Fuel Efficiency"
          value={performance.fuelEfficiency}
          icon={<Zap size={20} style={{ color: "var(--primary)" }} />}
        />
        <KPICard
          title="On-Time Delivery"
          value={`${performance.onTimeRate}%`}
          icon={<BarChart3 size={20} style={{ color: "var(--success)" }} />}
        />
        <KPICard
          title="Operator Rating"
          value={formatRating(performance.averageRating)}
          icon={<Heart size={20} style={{ color: "var(--danger)" }} />}
        />
      </div>

      {/* Safety Score Trend Chart */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", alignItems: "stretch" }}>
        <Card title="Safety score trends" subtitle="Chronological rating over last 6 months">
          <div style={{ width: "100%", height: "260px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
                <YAxis domain={[60, 100]} stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Violations and warnings summary */}
        <Card title="Violation Registry" subtitle="Compliance audit summaries">
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.5rem" }}>
            {/* Safe trips */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Safe Trips Completed:</span>
              <strong style={{ fontSize: "1.1rem", color: "var(--success)" }}>{performance.safeTrips}</strong>
            </div>

            {/* Warnings */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 0.75rem", borderRadius: "var(--radius-sm)", backgroundColor: "var(--warning-light)", border: "1px solid hsla(var(--warning-h), var(--warning-s), var(--warning-l), 0.15)" }}>
              <AlertTriangle size={18} style={{ color: "var(--warning)" }} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>WARNINGS ASSIGNED</span>
                <strong style={{ fontSize: "0.95rem" }}>{performance.warnings}</strong>
              </div>
            </div>

            {/* Violations */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 0.75rem", borderRadius: "var(--radius-sm)", backgroundColor: "var(--danger-light)", border: "1px solid hsla(var(--danger-h), var(--danger-s), var(--danger-l), 0.15)" }}>
              <AlertCircle size={18} style={{ color: "var(--danger)" }} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>TOTAL VIOLATIONS</span>
                <strong style={{ fontSize: "0.95rem" }}>{performance.violations}</strong>
              </div>
            </div>

            {/* Accidents */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
              <span style={{ color: "var(--text-secondary)" }}>Roadside Accidents:</span>
              <strong style={{ color: performance.accidents > 0 ? "var(--danger)" : "var(--text-primary)" }}>{performance.accidents}</strong>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DriverPerformance;
