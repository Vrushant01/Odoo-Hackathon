import React, { useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import Navbar from "./Navbar/Navbar";
import styles from "./MainLayout.module.css";

export const MainLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={styles.appContainer}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div
        className={`${styles.mainWrapper} ${
          isCollapsed ? styles.mainWrapperExpanded : ""
        }`}
      >
        <Navbar />
        <main className={styles.contentArea}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
