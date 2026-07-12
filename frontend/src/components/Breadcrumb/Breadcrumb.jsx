import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import styles from "./Breadcrumb.module.css";

export const Breadcrumb = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav className={styles.nav} aria-label="Breadcrumb">
      <ul className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className={styles.item}>
              {index > 0 && (
                <span className={styles.separator}>
                  <ChevronRight size={12} />
                </span>
              )}
              {isLast ? (
                <span className={styles.active}>{item.label}</span>
              ) : (
                <Link to={item.route} className={styles.link}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumb;
