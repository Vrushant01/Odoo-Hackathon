import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { MoreVertical } from "lucide-react";

export const ActionMenu = ({ children, isOpen, onOpen, onClose, status }) => {
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const getStatusColor = (status) => {
    const normalized = status ? String(status).toLowerCase().trim() : "";
    switch (normalized) {
      // Success states
      case "active":
      case "completed":
      case "success":
      case "online":
      case "ready":
      case "available":
        return "var(--success)";
      
      // Warning / Pending / In Transit states
      case "warning":
      case "pending":
      case "in progress":
      case "in-progress":
      case "in transit":
      case "in-transit":
        return "var(--warning)";
        
      // Danger / Cancelled / Delayed states
      case "danger":
      case "cancelled":
      case "critical":
      case "offline":
      case "delayed":
      case "suspended":
        return "var(--danger)";
        
      // Info / Dispatched / On Trip states
      case "info":
      case "scheduled":
      case "on trip":
      case "on-trip":
        return "var(--info)";
        
      case "dispatched":
      case "draft":
      default:
        return "var(--text-secondary)";
    }
  };

  const resolvedColor = status ? getStatusColor(status) : "var(--text-muted)";


  // Update menu position based on trigger dimensions and viewport limits
  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    // Approximate menu measurements
    const menuWidth = 180;
    const menuHeight = menuRef.current ? menuRef.current.offsetHeight : 280;
    
    let top = rect.bottom + window.scrollY;
    let left = rect.right - menuWidth + window.scrollX;

    // Viewport collision: check bottom constraint (open upward if not enough space below)
    if (rect.bottom + menuHeight > viewportHeight && rect.top - menuHeight > 0) {
      top = rect.top - menuHeight + window.scrollY;
    }

    // Viewport collision: check left edge
    if (left < 0) {
      left = rect.left + window.scrollX;
    }
    // Viewport collision: check right edge
    if (left + menuWidth > viewportWidth) {
      left = viewportWidth - menuWidth - 10;
    }

    setCoords({ top, left });
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      // Keep position updated on window resize
      window.addEventListener("resize", updatePosition);
      // Requirement 9: Close menu immediately if scroll container moves
      window.addEventListener("scroll", onClose, { capture: true, passive: true });
    }
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", onClose, { capture: true });
    };
  }, [isOpen, onClose]);

  // Click outside listener
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  // Keyboard navigation & accessibility focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        if (triggerRef.current) triggerRef.current.focus();
        return;
      }

      if (!menuRef.current) return;
      const items = Array.from(menuRef.current.querySelectorAll("button, a"));
      if (items.length === 0) return;

      const activeIndex = items.indexOf(document.activeElement);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = (activeIndex + 1) % items.length;
        items[nextIndex].focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex = (activeIndex - 1 + items.length) % items.length;
        items[prevIndex].focus();
      } else if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === items[0]) {
            e.preventDefault();
            items[items.length - 1].focus();
          }
        } else {
          if (document.activeElement === items[items.length - 1]) {
            e.preventDefault();
            items[0].focus();
          }
        }
      }
    };

    // Auto-focus first interactive item
    const timer = setTimeout(() => {
      if (menuRef.current) {
        const firstItem = menuRef.current.querySelector("button, a");
        if (firstItem) firstItem.focus();
      }
    }, 50);

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (isOpen) {
            onClose();
          } else {
            onOpen();
          }
        }}
        style={{
          background: isHovered || isFocused ? "rgba(255, 255, 255, 0.05)" : "none",
          border: "none",
          color: resolvedColor,
          cursor: "pointer",
          padding: "0.25rem",
          borderRadius: "var(--radius-xs)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          outline: isFocused ? "1px solid var(--border-focus)" : "none",
          opacity: isHovered || isFocused || isOpen ? 1 : 0.8,
          transition: "all var(--transition-fast)"
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <MoreVertical size={18} />
      </button>
      {isOpen &&
        ReactDOM.createPortal(
          <div
            ref={menuRef}
            style={{
              position: "absolute",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: "180px",
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-xl)",
              zIndex: 9999, // Requirement 5: High Z-Index
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              animation: "fadeInScale 0.15s ease-out"
            }}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            {children}
          </div>,
          document.body
        )}
    </>
  );
};

export default ActionMenu;
