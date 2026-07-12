import React from "react";
import { Gauge, Route, Weight, Hourglass } from "lucide-react";
import Card from "../Card/Card";

export const TripStatistics = ({ stats }) => {
  if (!stats) return null;

  const { distance = 0, cargoDelivered = 0, averageSpeed = "0 mph", duration = "0 hrs", completionRate = 0 } = stats;

  // Completion indicator color
  const getIndicatorColor = (rate) => {
    if (rate === 100) return "var(--success)";
    if (rate > 0) return "var(--primary)";
    return "var(--text-muted)";
  };

  return (
    <Card title="Trip Statistics" subtitle="Live logistics metrics">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "1.5rem", alignItems: "center" }}>
        {/* Completion Circular Progress Dial */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: `conic-gradient(${getIndicatorColor(completionRate)} ${completionRate * 3.6}deg, var(--bg-tertiary) 0deg)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.1)",
            position: "relative"
          }}>
            {/* Center mask */}
            <div style={{
              width: "96px",
              height: "96px",
              borderRadius: "50%",
              backgroundColor: "var(--bg-secondary)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <strong style={{ fontSize: "1.5rem", color: "var(--text-primary)" }}>{completionRate}%</strong>
              <span style={{ fontSize: "0.65rem", color: "var(--text-secondary)", fontWeight: 700 }}>COMPLETED</span>
            </div>
          </div>
        </div>

        {/* Stats Parameters Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Route size={12} /> DISTANCE
            </span>
            <strong style={{ fontSize: "1.1rem" }}>{distance.toLocaleString()} mi</strong>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Weight size={12} /> PAYLOAD
            </span>
            <strong style={{ fontSize: "1.1rem" }}>{cargoDelivered.toLocaleString()} lbs</strong>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem" }}>
              SPEED
            </span>
            <strong style={{ fontSize: "1.1rem" }}>{averageSpeed}</strong>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Hourglass size={12} /> DURATION
            </span>
            <strong style={{ fontSize: "1.1rem" }}>{duration}</strong>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TripStatistics;
