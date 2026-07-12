import React from "react";
import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight, Truck, Layout } from "lucide-react";
import * as Icons from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { SIDEBAR_ITEMS } from "../../constants/permissions";
import styles from "./Sidebar.module.css";

export const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { hasPermission } = useAuth();

  // Dynamically resolve icon components from lucide-react strings
  const getIcon = (iconName) => {
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent size={20} /> : <Icons.HelpCircle size={20} />;
  };

  // Filter items matching user permissions
  const filteredItems = SIDEBAR_ITEMS.filter(
    (item) => !item.permission || hasPermission(item.permission)
  );

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}>
      <div className={styles.logoContainer}>
        <div className={styles.logoIcon}>
          <Truck size={28} strokeWidth={2.5} />
        </div>
        <span className={styles.logoText}>TransitOps</span>
      </div>

      <nav style={{ flex: 1, overflowY: "auto" }}>
        <ul className={styles.menuList}>
          {filteredItems.map((item) => (
            <li key={item.title} className={styles.menuItem}>
              <NavLink
                to={item.route}
                className={({ isActive }) =>
                  `${styles.menuLink} ${isActive ? styles.activeLink : ""}`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <div className={styles.activeIndicator} />}
                    {getIcon(item.icon)}
                    <span className={styles.menuText}>{item.title}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.toggleButton}
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
