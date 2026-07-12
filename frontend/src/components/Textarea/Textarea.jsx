import React, { forwardRef } from "react";
import styles from "./Textarea.module.css";

export const Textarea = forwardRef(({
  label,
  error,
  className = "",
  disabled = false,
  ...props
}, ref) => {
  const textareaClass = [
    styles.textarea,
    error ? styles.textareaError : "",
    className
  ].join(" ").trim();

  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea
        ref={ref}
        className={textareaClass}
        disabled={disabled}
        {...props}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
});

Textarea.displayName = "Textarea";

export default Textarea;
