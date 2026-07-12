import React from "react";
import styles from "./Card.module.css";

export const Card = ({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  interactive = false,
  glass = false,
  className = "",
  contentClassName = "",
  ...props
}) => {
  const cardClass = [
    styles.card,
    interactive ? styles.interactive : "",
    glass ? styles.glass : "",
    className
  ].join(" ").trim();

  return (
    <div className={cardClass} {...props}>
      {(title || subtitle || headerAction) && (
        <div className={styles.cardHeader}>
          <div>
            {title && <h4 className={styles.cardTitle}>{title}</h4>}
            {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
          </div>
          {headerAction && <div className="card-header-action">{headerAction}</div>}
        </div>
      )}
      <div className={`${styles.cardContent} ${contentClassName}`}>
        {children}
      </div>
      {footer && <div className={styles.cardFooter}>{footer}</div>}
    </div>
  );
};

export default Card;
