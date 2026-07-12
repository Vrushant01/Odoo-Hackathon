import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, AlertTriangle } from "lucide-react";
import Card from "../Card/Card";
import Button from "../Button/Button";

export const OverdueMaintenance = ({ records = [] }) => {
  const navigate = useNavigate();

  const handleAction = (id) => {
    navigate(`/maintenance?id=${id}`);
  };

  const overdue = [...records].filter((r) => r.status === "Overdue" || r.status === "overdue");

  return (
    <Card
      title="Overdue Maintenance"
      subtitle="Critical servicing delays requiring action"
      headerAction={<ShieldAlert size={18} style={{ color: "var(--danger)" }} />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "320px", overflowY: "auto", paddingRight: "0.25rem" }}>
        {overdue.length === 0 ? (
          <div style={{ textAlign: "center", padding: "1.5rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
            No overdue maintenance tasks reported.
          </div>
        ) : (
          overdue.map((r) => (
            <div
              key={r.id}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--danger-light)",
                border: "1px solid hsla(var(--danger-h), var(--danger-s), var(--danger-l), 0.15)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem"
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                <AlertTriangle size={16} style={{ color: "var(--danger)", marginTop: "0.125rem" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <strong style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>{r.vehicle}</strong>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    {r.type} • Was due: <strong style={{ color: "var(--danger)" }}>{r.scheduledDate}</strong>
                  </span>
                </div>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleAction(r.id)}
                style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
              >
                Inspect
              </Button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default OverdueMaintenance;
