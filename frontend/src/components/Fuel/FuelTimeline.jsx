import React from "react";
import { PlusCircle, FileText, CheckCircle2, Settings } from "lucide-react";

export const FuelTimeline = ({ date }) => {
  const list = [
    { title: "Payment Completed", description: "Refuel card transaction cleared by payment gateway.", date: `${date || "2026-07-12"} 11:15` },
    { title: "Invoice Uploaded", description: "Receipt copy attached to fuel log repository.", date: `${date || "2026-07-12"} 11:00` },
    { title: "Fuel Log Added", description: "Refueling entry registered in depot worksheets.", date: `${date || "2026-07-12"} 10:45` }
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

      {list.map((ev, idx) => (
        <div key={idx} style={{ display: "flex", gap: "1.25rem", zIndex: 1, position: "relative" }}>
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: "var(--bg-secondary)",
            border: `2px solid var(--primary)`,
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}>
            {ev.title.includes("Payment") ? <CheckCircle2 size={14} /> :
             ev.title.includes("Invoice") ? <FileText size={14} /> : <PlusCircle size={14} />}
          </div>

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

export default FuelTimeline;
