import React from "react";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import styles from "./PageHeader.module.css";

export const PageHeader = ({
  title,
  subtitle,
  breadcrumbItems = [],
  action,
  className = ""
}) => {
  return (
    <div className={`${className}`}>
      {breadcrumbItems && breadcrumbItems.length > 0 && (
        <Breadcrumb items={breadcrumbItems} />
      )}
      <div className={styles.headerContainer}>
        <div className={styles.textSection}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {action && <div className={styles.actionSection}>{action}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
