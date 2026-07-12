import React from "react";
import { useNavigate } from "react-router-dom";
import { Wrench, Calendar, AlertTriangle } from "lucide-react";
import Card from "../Card/Card";
import StatusBadge from "../StatusBadge/StatusBadge";
import Button from "../Button/Button";

export const MaintenanceWidget = ({ maintenance }) => {
  const navigate = useNavigate();

  const handleActionClick = (id) => {
    navigate(`/maintenance?id=${id}`);
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "var(--danger)";
      case "medium":
        return "var(--warning)";
      case "low":
      default:
        return "var(--success)";
    }
  };

  return (
    <Card
      title="Upcoming Maintenance"
      subtitle="Scheduled fleet inspections & repairs"
      headerAction={<Wrench size={18} style={{ color: "var(--warning)" }} />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxHeight: "360px", overflowY: "auto", paddingRight: "0.25rem" }}>
        {(!maintenance || maintenance.length === 0) ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            No upcoming maintenance schedules matching filters.
          </div>
        ) : (
          maintenance.map((m) => (
            <div
              key={m.id}
              className="glass-panel"
              style={{
                padding: "1rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem"
              }}
            >
              {/* Header: Vehicle Plate & Status */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 700 }}>
                  {m.vehicle}
                </span>
                <StatusBadge status={m.status} />
              </div>

              {/* Maintenance Type & Priority */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{m.type}</span>
                <span style={{
                  color: getPriorityColor(m.priority),
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem"
                }}>
                  <AlertTriangle size={12} />
                  {m.priority} Priority
                </span>
              </div>

              {/* Date & Mechanic */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.5rem",
                fontSize: "0.8rem",
                color: "var(--text-secondary)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <Calendar size={12} />
                  <span>Due: {m.scheduledDate}</span>
                </div>
                <div>
                  <span>Mechanic: <strong style={{ color: "var(--text-primary)" }}>{m.mechanic}</strong></span>
                </div>
              </div>

              {/* Actions Button */}
              <div style={{
                display: "flex",
                justifyContent: "flex-end",
                paddingTop: "0.5rem",
                borderTop: "1px solid var(--border-color)"
              }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleActionClick(m.id)}
                >
                  Manage Sheet
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default MaintenanceWidget;
