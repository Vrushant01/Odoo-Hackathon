import React from "react";
import styles from "./StatusBadge.module.css";

const statusToVariantMap = {
  // Success states
  active: "success",
  completed: "success",
  success: "success",
  online: "success",
  ready: "success",
  
  // Warning states
  maintenance: "warning",
  warning: "warning",
  pending: "warning",
  "in progress": "warning",
  "in-progress": "warning",
  
  // Danger states
  inactive: "danger",
  danger: "danger",
  cancelled: "danger",
  critical: "danger",
  offline: "danger",
  
  // Info states
  info: "info",
  scheduled: "info",
  "on trip": "info",
  "on-trip": "info"
};

export const StatusBadge = ({
  status,
  variant,
  showDot = true,
  className = ""
}) => {
  // Determine variant based on mapping or fallback to neutral
  const normalizedStatus = status ? String(status).toLowerCase().trim() : "";
  const resolvedVariant = variant || statusToVariantMap[normalizedStatus] || "neutral";

  const badgeClass = [
    styles.badge,
    styles[resolvedVariant],
    className
  ].join(" ").trim();

  return (
    <span className={badgeClass}>
      {showDot && <span className={styles.dot} />}
      {status}
    </span>
  );
};

export default StatusBadge;
