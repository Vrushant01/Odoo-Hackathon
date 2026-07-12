import React from "react";
import { PlusCircle, Compass, CheckCircle2, AlertOctagon, Wrench, Fuel, Landmark } from "lucide-react";

export const TripTimeline = ({ timeline = [], status }) => {
  const getIcon = (type) => {
    switch (type) {
      case "creation":
        return <PlusCircle size={14} />;
      case "dispatch":
        return <Compass size={14} />;
      case "success":
        return <CheckCircle2 size={14} />;
      case "cancel":
        return <AlertOctagon size={14} />;
      case "fuel":
        return <Fuel size={14} />;
      case "checkpoint":
        return <Landmark size={14} />;
      default:
        return <Landmark size={14} />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case "success":
        return "var(--success)";
      case "cancel":
        return "var(--danger)";
      case "fuel":
        return "var(--warning)";
      case "dispatch":
        return "var(--primary)";
      default:
        return "var(--text-muted)";
    }
  };

  const list = timeline.length > 0 ? timeline : [
    { title: "Trip Registered", description: "Trip order created by logistics dispatcher.", date: "2026-07-12 10:00", type: "creation" }
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
        const color = getColor(ev.type);
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
              {getIcon(ev.type)}
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

export default TripTimeline;
