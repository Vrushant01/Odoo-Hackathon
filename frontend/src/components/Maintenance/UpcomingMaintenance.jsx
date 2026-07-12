import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ChevronRight } from "lucide-react";
import Card from "../Card/Card";
import StatusBadge from "../StatusBadge/StatusBadge";
import Button from "../Button/Button";

export const UpcomingMaintenance = ({ records = [] }) => {
  const navigate = useNavigate();

  const handleAction = (id) => {
    navigate(`/maintenance?id=${id}`);
  };

  // Filter & Sort nearest upcoming dates
  const upcoming = [...records]
    .filter((r) => r.status === "Scheduled")
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));

  return (
    <Card title="Upcoming Maintenance" subtitle="Scheduled preventative servicing" headerAction={<Calendar size={18} />}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "320px", overflowY: "auto", paddingRight: "0.25rem" }}>
        {upcoming.length === 0 ? (
          <div style={{ textAlign: "center", padding: "1.5rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
            No upcoming maintenance scheduled.
          </div>
        ) : (
          upcoming.map((r) => (
            <div
              key={r.id}
              className="glass-panel"
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-color)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem"
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                <strong style={{ fontSize: "0.85rem" }}>{r.vehicle}</strong>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  {r.type} • Due: <strong>{r.scheduledDate}</strong>
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction(r.id)}
                style={{ padding: "0.25rem" }}
              >
                <ChevronRight size={14} />
              </Button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default UpcomingMaintenance;
