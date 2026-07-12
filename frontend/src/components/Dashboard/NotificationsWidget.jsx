import React from "react";
import { Bell, AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";
import Card from "../Card/Card";

export const NotificationsWidget = ({ notifications }) => {
  const getIcon = (type) => {
    switch (type) {
      case "danger":
      case "critical":
        return <AlertCircle size={16} style={{ color: "var(--danger)" }} />;
      case "warning":
        return <AlertTriangle size={16} style={{ color: "var(--warning)" }} />;
      case "success":
        return <CheckCircle size={16} style={{ color: "var(--success)" }} />;
      case "info":
      default:
        return <Info size={16} style={{ color: "var(--info)" }} />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case "danger":
      case "critical":
        return "1px solid hsla(var(--danger-h), var(--danger-s), var(--danger-l), 0.15)";
      case "warning":
        return "1px solid hsla(var(--warning-h), var(--warning-s), var(--warning-l), 0.15)";
      case "success":
        return "1px solid hsla(var(--success-h), var(--success-s), var(--success-l), 0.15)";
      case "info":
      default:
        return "1px solid hsla(var(--info-h), var(--info-s), var(--info-l), 0.15)";
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case "danger":
      case "critical":
        return "var(--danger-light)";
      case "warning":
        return "var(--warning-light)";
      case "success":
        return "var(--success-light)";
      case "info":
      default:
        return "var(--info-light)";
    }
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Card
      title="Alerts Console"
      subtitle="Operational notifications"
      headerAction={<Bell size={18} style={{ color: "var(--primary)" }} />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "360px", overflowY: "auto", paddingRight: "0.25rem" }}>
        {(!notifications || notifications.length === 0) ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            No operational alerts reported.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              style={{
                display: "flex",
                gap: "0.75rem",
                padding: "0.875rem 1rem",
                borderRadius: "var(--radius-md)",
                background: getBgColor(n.type),
                border: getBorderColor(n.type),
                alignItems: "flex-start"
              }}
            >
              <div style={{ flexShrink: 0, marginTop: "0.125rem" }}>
                {getIcon(n.type)}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                <strong style={{ fontSize: "0.825rem", color: "var(--text-primary)" }}>{n.title}</strong>
                <p style={{ fontSize: "0.775rem", color: "var(--text-secondary)", lineHeight: 1.3 }}>{n.message}</p>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.25rem", fontWeight: 600 }}>
                  {formatTime(n.timestamp || new Date())}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default NotificationsWidget;
