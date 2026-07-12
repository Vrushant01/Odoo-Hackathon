import React, { forwardRef } from "react";
import styles from "./DatePicker.module.css";

export const DatePicker = forwardRef(({
  label,
  error,
  className = "",
  disabled = false,
  ...props
}, ref) => {
  const dateClass = [
    styles.input,
    error ? styles.inputError : "",
    className
  ].join(" ").trim();

  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        ref={ref}
        type="date"
        className={dateClass}
        disabled={disabled}
        {...props}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
});

DatePicker.displayName = "DatePicker";

export default DatePicker;
