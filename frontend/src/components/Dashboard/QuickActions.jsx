import React from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Truck, UserPlus, Route, Wrench, Fuel, FileText } from "lucide-react";
import Card from "../Card/Card";

export const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    { title: "Register Vehicle", icon: <Truck size={20} />, route: "/vehicles?action=create", color: "var(--primary)" },
    { title: "Add Driver", icon: <UserPlus size={20} />, route: "/drivers?action=create", color: "var(--success)" },
    { title: "Create Trip", icon: <Route size={20} />, route: "/trips?action=create", color: "var(--info)" },
    { title: "Schedule Service", icon: <Wrench size={20} />, route: "/maintenance?action=create", color: "var(--warning)" },
    { title: "Log Fuel Receipt", icon: <Fuel size={20} />, route: "/fuel?action=create", color: "var(--primary)" },
    { title: "Generate Report", icon: <FileText size={20} />, route: "/reports?action=create", color: "var(--text-muted)" }
  ];

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h3 style={{
        fontFamily: "var(--font-accent)",
        fontWeight: 700,
        fontSize: "1.25rem",
        marginBottom: "1rem",
        color: "var(--text-primary)"
      }}>
        Operator Shortcuts
      </h3>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "1rem"
      }}>
        {actions.map((act) => (
          <div
            key={act.title}
            onClick={() => navigate(act.route)}
            className="glass-panel interactive"
            style={{
              padding: "1.25rem 1rem",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              textAlign: "center",
              border: "1px solid var(--border-color)"
            }}
          >
            <div style={{
              padding: "0.625rem",
              borderRadius: "50%",
              backgroundColor: "var(--bg-primary)",
              color: act.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {act.icon}
            </div>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>
              {act.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
