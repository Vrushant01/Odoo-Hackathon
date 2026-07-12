import React from "react";
import { Clock, Mail, ToggleLeft, ToggleRight, Calendar } from "lucide-react";
import Card from "../Card/Card";

export const ScheduledReports = ({ schedules = [], onToggle }) => {
  return (
    <Card title="Scheduled Reports" subtitle="Automated report delivery schedules (backend integration pending)">
      {schedules.length === 0 ? (
        <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem", fontSize: "0.85rem" }}>
          No scheduled reports configured.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="glass-panel"
              style={{
                padding: "1rem 1.25rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem",
                opacity: schedule.enabled ? 1 : 0.6,
                transition: "opacity var(--transition-fast)"
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", minWidth: 0 }}>
                <strong style={{ fontSize: "0.9rem" }}>{schedule.name}</strong>
                <div style={{ display: "flex", gap: "1rem", fontSize: "0.8rem", color: "var(--text-muted)", flexWrap: "wrap" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Calendar size={12} /> {schedule.schedule} — {schedule.day}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Clock size={12} /> {schedule.time}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Mail size={12} /> {schedule.recipients.length} recipient{schedule.recipients.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Format: {schedule.format} • Last run: {schedule.lastRun}
                </span>
              </div>

              <button
                onClick={() => onToggle(schedule.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.5rem 0.875rem",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-color)",
                  backgroundColor: schedule.enabled ? "color-mix(in srgb, var(--success) 12%, transparent)" : "var(--bg-secondary)",
                  color: schedule.enabled ? "var(--success)" : "var(--text-muted)",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  transition: "all var(--transition-fast)",
                  whiteSpace: "nowrap"
                }}
              >
                {schedule.enabled ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                {schedule.enabled ? "Enabled" : "Disabled"}
              </button>
            </div>
          ))}

          <div style={{
            padding: "0.75rem",
            borderRadius: "var(--radius-sm)",
            backgroundColor: "color-mix(in srgb, var(--info) 8%, transparent)",
            border: "1px solid color-mix(in srgb, var(--info) 20%, transparent)",
            fontSize: "0.8rem",
            color: "var(--info)",
            fontWeight: 600
          }}>
            ℹ️ Scheduled report delivery requires backend integration. This UI is a placeholder for future implementation.
          </div>
        </div>
      )}
    </Card>
  );
};

export default ScheduledReports;
