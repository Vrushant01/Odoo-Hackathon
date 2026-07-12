import React from "react";
import {
  Fuel, TrendingUp, Wrench, Award, DollarSign,
  Truck, BarChart3, Navigation
} from "lucide-react";
import Card from "../Card/Card";

const ICON_MAP = {
  Fuel: Fuel,
  TrendingUp: TrendingUp,
  Wrench: Wrench,
  Award: Award,
  DollarSign: DollarSign,
  Truck: Truck,
  BarChart3: BarChart3,
  Navigation: Navigation
};

export const InsightsPanel = ({ insights = [] }) => {
  if (!insights.length) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h3 style={{ fontFamily: "var(--font-accent)", fontSize: "1.15rem", fontWeight: 800 }}>
        Operational Insights
      </h3>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "1rem"
      }}>
        {insights.map((insight) => {
          const IconComponent = ICON_MAP[insight.icon] || BarChart3;
          return (
            <div
              key={insight.id}
              className="glass-panel"
              style={{
                padding: "1.25rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                display: "flex",
                gap: "1rem",
                alignItems: "flex-start",
                transition: "transform var(--transition-fast), box-shadow var(--transition-fast)",
                cursor: "default"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "var(--shadow-lg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: `color-mix(in srgb, ${insight.color} 15%, transparent)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                <IconComponent size={20} style={{ color: insight.color }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", minWidth: 0 }}>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  {insight.title}
                </span>
                <strong style={{ fontSize: "0.95rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {insight.value}
                </strong>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  {insight.metric}
                </span>
                <span style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: insight.trend === "up" ? "var(--success)" :
                         insight.trend === "down" ? "var(--danger)" :
                         "var(--text-muted)"
                }}>
                  {insight.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InsightsPanel;
