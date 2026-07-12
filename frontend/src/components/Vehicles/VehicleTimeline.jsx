import React from "react";
import { PlusCircle, Compass, CheckCircle2, Wrench, Fuel, AlertOctagon } from "lucide-react";

export const VehicleTimeline = ({ vehicle }) => {
  if (!vehicle) return null;

  // Auto-generate activity logs to look realistic per vehicle
  const events = [
    {
      title: "Vehicle Status Active",
      description: `Asset designated as ${vehicle.status} in ${vehicle.region} region.`,
      date: "2026-07-12",
      icon: <CheckCircle2 size={14} />,
      color: "var(--success)"
    }
  ];

  if (vehicle.status === "Retired") {
    events.unshift({
      title: "Vehicle Retired",
      description: "Asset decommissioned from active trips dispatch due to odometer thresholds.",
      date: vehicle.nextMaintenance || "2026-07-10",
      icon: <AlertOctagon size={14} />,
      color: "var(--danger)"
    });
  }

  if (vehicle.lastMaintenance) {
    events.push({
      title: "Maintenance Completed",
      description: `Service complete. Last logged: ${vehicle.notes || "Routine service"}.`,
      date: vehicle.lastMaintenance,
      icon: <Wrench size={14} />,
      color: "var(--warning)"
    });
  }

  if (vehicle.purchaseDate) {
    events.push({
      title: "Vehicle Registered",
      description: `Asset acquired for ${formatCost(vehicle.cost)} with initial odometer of ${formatOdo(vehicle.odometer)}.`,
      date: vehicle.purchaseDate,
      icon: <PlusCircle size={14} />,
      color: "var(--primary)"
    });
  }

  function formatCost(val) { return `$${Number(val).toLocaleString()}`; }
  function formatOdo(val) { return `${Number(val).toLocaleString()} mi`; }

  return (
    <div style={{ padding: "0.5rem 0", display: "flex", flexDirection: "column", gap: "1.5rem", position: "relative" }}>
      {/* Vertical line connector */}
      <div style={{
        position: "absolute",
        left: "15px",
        top: "10px",
        bottom: "10px",
        width: "2px",
        backgroundColor: "var(--border-color)",
        zIndex: 0
      }} />

      {events.map((ev, idx) => (
        <div key={idx} style={{ display: "flex", gap: "1.25rem", zIndex: 1, position: "relative" }}>
          {/* Node */}
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: "var(--bg-secondary)",
            border: `2px solid ${ev.color}`,
            color: ev.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}>
            {ev.icon}
          </div>

          {/* Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>{ev.date}</span>
            <strong style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>{ev.title}</strong>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>{ev.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VehicleTimeline;
