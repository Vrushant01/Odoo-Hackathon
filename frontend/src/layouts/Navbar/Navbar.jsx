import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, Bell, LogOut, Settings, User } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";
import SearchBar from "../../components/SearchBar/SearchBar";
import { MOCK_NOTIFICATIONS } from "../../mock-data/notifications";
import styles from "./Navbar.module.css";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [searchVal, setSearchVal] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleNotificationClick = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <header className={styles.navbar}>
      {/* Global Search Bar Placeholder */}
      <div className={styles.searchSection}>
        <SearchBar
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Global search..."
        />
      </div>

      <div className={styles.actionSection}>
        {/* Theme Toggle */}
        <button
          type="button"
          className={styles.iconButton}
          onClick={toggleTheme}
          aria-label="Toggle theme mode"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Notifications Icon & Popover */}
        <div className={styles.profileContainer} ref={notifRef}>
          <button
            type="button"
            className={styles.iconButton}
            onClick={() => setShowNotif(!showNotif)}
            aria-label="View notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
          </button>

          {showNotif && (
            <div className={styles.notifDropdown}>
              <div className={styles.notifHeader}>
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 600 }}>
                    {unreadCount} unread
                  </span>
                )}
              </div>
              <ul className={styles.notifList}>
                {notifications.length === 0 ? (
                  <li style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    No notifications
                  </li>
                ) : (
                  notifications.map((notif) => (
                    <li
                      key={notif.id}
                      className={`${styles.notifItem} ${!notif.read ? styles.unread : ""}`}
                      onClick={() => handleNotificationClick(notif.id)}
                    >
                      <p className={styles.notifTitle}>{notif.title}</p>
                      <p className={styles.notifMessage}>{notif.message}</p>
                      <p className={styles.notifTime}>{formatTime(notif.timestamp)}</p>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        {/* User Account Menu Dropdown */}
        <div className={styles.profileContainer} ref={profileRef}>
          <div className={styles.profileBadge} onClick={() => setShowProfile(!showProfile)}>
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=80"}
              alt={user?.name || "User Avatar"}
              className={styles.avatar}
            />
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.name || "Transit Guest"}</span>
              <span className={styles.userRole}>{user?.role || "Operator"}</span>
            </div>
          </div>

          {showProfile && (
            <div className={styles.dropdown}>
              <button
                type="button"
                className={styles.dropdownItem}
                onClick={() => { navigate("/settings"); setShowProfile(false); }}
              >
                <Settings size={16} />
                Settings
              </button>
              <button
                type="button"
                className={`${styles.dropdownItem} ${styles.logoutItem}`}
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
