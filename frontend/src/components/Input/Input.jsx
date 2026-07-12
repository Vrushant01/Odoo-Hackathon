import React, { forwardRef } from "react";
import styles from "./Input.module.css";

export const Input = forwardRef(({
  label,
  type = "text",
  error,
  startIcon,
  endIcon,
  onEndIconClick,
  className = "",
  disabled = false,
  ...props
}, ref) => {
  const inputClass = [
    styles.input,
    error ? styles.inputError : "",
    startIcon ? styles.iconStart : "",
    endIcon ? styles.iconEnd : "",
    className
  ].join(" ").trim();

  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputContainer}>
        {startIcon && (
          <div className={styles.startIconWrapper}>
            {startIcon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={inputClass}
          disabled={disabled}
          {...props}
        />
        {endIcon && (
          <div className={styles.endIconWrapper} onClick={onEndIconClick}>
            {endIcon}
          </div>
        )}
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
