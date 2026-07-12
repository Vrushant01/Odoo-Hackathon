import React, { forwardRef } from "react";
import styles from "./Select.module.css";

export const Select = forwardRef(({
  label,
  options = [],
  error,
  placeholder,
  className = "",
  disabled = false,
  children,
  ...props
}, ref) => {
  const selectClass = [
    styles.select,
    error ? styles.selectError : "",
    className
  ].join(" ").trim();

  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <select
        ref={ref}
        className={selectClass}
        disabled={disabled}
        {...props}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {children ? children : options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
});

Select.displayName = "Select";

export default Select;
