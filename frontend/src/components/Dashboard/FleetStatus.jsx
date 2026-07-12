import React from "react";
import { useNavigate } from "react-router-dom";
import { Compass, CheckCircle2, Wrench, AlertTriangle } from "lucide-react";
import Card from "../Card/Card";

export const FleetStatus = ({ vehicles }) => {
  const navigate = useNavigate();

  if (!vehicles) return null;

  const total = vehicles.total || 0;

  const statusConfigs = [
    { label: "Available", count: vehicles.available || 0, color: "var(--success)", icon: <CheckCircle2 size={16} />, path: "Active" },
    { label: "On Trip", count: vehicles.onTrip || 0, color: "var(--primary)", icon: <Compass size={16} />, path: "Active" },
    { label: "Maintenance", count: vehicles.maintenance || 0, color: "var(--warning)", icon: <Wrench size={16} />, path: "Maintenance" },
    { label: "Retired", count: vehicles.retired || 0, color: "var(--danger)", icon: <AlertTriangle size={16} />, path: "Inactive" }
  ];

  const handleStatusClick = (statusPath) => {
    navigate(`/vehicles?status=${statusPath}`);
  };

  return (
    <Card title="Fleet Status" subtitle="Vehicle availability breakdown">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "0.5rem" }}>
        {statusConfigs.map((cfg) => {
          const percentage = total > 0 ? (cfg.count / total) * 100 : 0;

          return (
            <div
              key={cfg.label}
              onClick={() => handleStatusClick(cfg.path)}
              style={{ cursor: "pointer" }}
            >
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.375rem"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ color: cfg.color, display: "flex" }}>{cfg.icon}</span>
                  <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{cfg.label}</span>
                </div>
                <span style={{ fontSize: "0.875rem", fontWeight: 700 }}>
                  {cfg.count} <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>/ {total}</span>
                </span>
              </div>

              {/* Progress Bar Container */}
              <div style={{
                height: "6px",
                backgroundColor: "var(--bg-tertiary)",
                borderRadius: "var(--radius-full)",
                overflow: "hidden"
              }}>
                <div style={{
                  width: `${percentage}%`,
                  height: "100%",
                  backgroundColor: cfg.color,
                  borderRadius: "var(--radius-full)",
                  transition: "width var(--transition-slow)"
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default FleetStatus;
