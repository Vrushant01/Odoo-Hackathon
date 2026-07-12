import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import styles from "./KPICard.module.css";

export const KPICard = ({
  title,
  value,
  icon,
  change,
  trend = "neutral", // 'up' | 'down' | 'neutral'
  className = ""
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <ArrowUpRight size={14} className={styles.up} />;
      case "down":
        return <ArrowDownRight size={14} className={styles.down} />;
      default:
        return <Minus size={14} className={styles.neutral} />;
    }
  };

  const getTrendClass = () => {
    switch (trend) {
      case "up":
        return styles.up;
      case "down":
        return styles.down;
      default:
        return styles.neutral;
    }
  };

  return (
    <div className={`${styles.kpiCard} ${className}`}>
      <div className={styles.infoSection}>
        <span className={styles.title}>{title}</span>
        <span className={styles.value}>{value}</span>
        {change && (
          <div className={styles.changeWrapper}>
            {getTrendIcon()}
            <span className={getTrendClass()}>{change}</span>
          </div>
        )}
      </div>
      {icon && (
        <div className={styles.iconWrapper}>
          {icon}
        </div>
      )}
    </div>
  );
};

export default KPICard;
