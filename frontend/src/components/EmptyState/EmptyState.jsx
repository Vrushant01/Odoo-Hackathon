import React from "react";
import { Inbox } from "lucide-react";
import styles from "./EmptyState.module.css";

export const EmptyState = ({
  title = "No data found",
  description = "There are no records matching your criteria. Try adjusting your filters or adding a new record.",
  icon,
  actionButton,
  className = ""
}) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.iconWrapper}>
        {icon || <Inbox size={32} />}
      </div>
      <h4 className={styles.title}>{title}</h4>
      <p className={styles.description}>{description}</p>
      {actionButton && <div className="empty-state-action">{actionButton}</div>}
    </div>
  );
};

export default EmptyState;
