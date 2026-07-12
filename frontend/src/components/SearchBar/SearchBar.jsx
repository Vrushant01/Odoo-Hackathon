import React from "react";
import { Search, X } from "lucide-react";
import styles from "./SearchBar.module.css";

export const SearchBar = ({
  value = "",
  onChange,
  onClear,
  placeholder = "Search...",
  className = ""
}) => {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      // Simulate change event for standard inputs if no dedicated clear handler is passed
      onChange({ target: { value: "" } });
    }
  };

  return (
    <div className={`${styles.searchContainer} ${className}`}>
      <div className={styles.searchIcon}>
        <Search size={16} />
      </div>
      <input
        type="text"
        className={styles.searchInput}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {value && (
        <button
          type="button"
          className={styles.clearButton}
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
