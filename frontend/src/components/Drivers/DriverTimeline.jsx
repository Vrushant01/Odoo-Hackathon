import React from "react";
import { UserPlus, Calendar, Link, Compass, CheckCircle2, AlertOctagon, Wrench } from "lucide-react";

export const DriverTimeline = ({ timeline = [], driver }) => {
  const getIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes("registered") || t.includes("hired")) return <UserPlus size={14} />;
    if (t.includes("assigned") || t.includes("vehicle")) return <Link size={14} />;
    if (t.includes("started") || t.includes("dispatch")) return <Compass size={14} />;
    if (t.includes("completed") || t.includes("safe")) return <CheckCircle2 size={14} />;
    if (t.includes("suspended") || t.includes("warn")) return <AlertOctagon size={14} />;
    return <Calendar size={14} />;
  };

  const getColor = (title) => {
    const t = title.toLowerCase();
    if (t.includes("suspended") || t.includes("expired") || t.includes("warn")) return "var(--danger)";
    if (t.includes("completed") || t.includes("active")) return "var(--success)";
    if (t.includes("assigned")) return "var(--warning)";
    return "var(--primary)";
  };

  const list = timeline.length > 0 ? timeline : [
    { title: "Status Confirmed", description: `Driver status logged as ${driver?.status || "Available"}.`, date: "2026-07-12" },
    { title: "Driver Registered", description: "Profile database initialized and background check complete.", date: driver?.joiningDate || "2026-01-01" }
  ];

  return (
    <div style={{ padding: "0.5rem 0", display: "flex", flexDirection: "column", gap: "1.5rem", position: "relative" }}>
      <div style={{
        position: "absolute",
        left: "15px",
        top: "10px",
        bottom: "10px",
        width: "2px",
        backgroundColor: "var(--border-color)",
        zIndex: 0
      }} />

      {list.map((ev, idx) => {
        const color = getColor(ev.title);
        return (
          <div key={idx} style={{ display: "flex", gap: "1.25rem", zIndex: 1, position: "relative" }}>
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "var(--bg-secondary)",
              border: `2px solid ${color}`,
              color: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              {getIcon(ev.title)}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>{ev.date}</span>
              <strong style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>{ev.title}</strong>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>{ev.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DriverTimeline;
