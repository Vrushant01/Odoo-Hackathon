import React from "react";
import { useNavigate } from "react-router-dom";
import { UserCheck, Compass, Moon, ShieldAlert, AlertOctagon } from "lucide-react";
import Card from "../Card/Card";

export const DriverStatus = ({ drivers }) => {
  const navigate = useNavigate();

  if (!drivers) return null;

  const total = drivers.total || 0;

  const statusConfigs = [
    { label: "Available", count: drivers.available || 0, color: "var(--success)", icon: <UserCheck size={16} />, path: "Active" },
    { label: "On Trip", count: drivers.onDuty || 0, color: "var(--primary)", icon: <Compass size={16} />, path: "On Trip" },
    { label: "Off Duty", count: drivers.offDuty || 0, color: "var(--text-muted)", icon: <Moon size={16} />, path: "Inactive" },
    { label: "Suspended", count: drivers.suspended || 0, color: "var(--danger)", icon: <ShieldAlert size={16} />, path: "Suspended" },
    { label: "Expired License", count: drivers.expiringLicense || 0, color: "var(--warning)", icon: <AlertOctagon size={16} />, path: "Expired" }
  ];

  const handleStatusClick = (statusPath) => {
    navigate(`/drivers?status=${statusPath}`);
  };

  return (
    <Card title="Driver Status" subtitle="Crew assignment and status logs">
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

export default DriverStatus;
