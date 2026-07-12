import React from "react";
import styles from "./Button.module.css";

export const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  startIcon,
  endIcon,
  onClick,
  className = "",
  ...props
}) => {
  const buttonClass = [
    styles.btn,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : "",
    className
  ].join(" ").trim();

  return (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <span className={styles.spinner} />}
      {!loading && startIcon && <span className="btn-start-icon">{startIcon}</span>}
      {children}
      {!loading && endIcon && <span className="btn-end-icon">{endIcon}</span>}
    </button>
  );
};

export default Button;
