import React, { useRef, useState } from "react";
import { UploadCloud, File, X } from "lucide-react";
import styles from "./FileUpload.module.css";

export const FileUpload = ({
  label,
  error,
  value,
  onChange,
  accept = "*",
  subtext = "PNG, JPG, PDF up to 10MB",
  disabled = false,
  maxSize = 10 * 1024 * 1024 // 10MB default
}) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndProcessFile = (file) => {
    setLocalError("");
    if (!file) return;

    if (file.size > maxSize) {
      setLocalError(`File size exceeds limit (${(maxSize / (1024 * 1024)).toFixed(0)}MB)`);
      return;
    }

    if (onChange) {
      onChange(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    if (disabled) return;
    fileInputRef.current.click();
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (onChange) onChange(null);
    setLocalError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const displayError = error || localError;

  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      
      {!value ? (
        <div
          className={`${styles.dropzone} ${dragActive ? styles.active : ""} ${
            disabled ? styles.disabled : ""
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden-file-input"
            style={{ display: "none" }}
            accept={accept}
            onChange={handleFileChange}
            disabled={disabled}
          />
          <UploadCloud className={styles.icon} size={36} />
          <p className={styles.text}>
            <span className={styles.highlight}>Click to upload</span> or drag and drop
          </p>
          <p className={styles.subtext}>{subtext}</p>
        </div>
      ) : (
        <div className={styles.filePreview}>
          <div className={styles.fileDetails}>
            <File className={styles.fileIcon} size={20} />
            <div>
              <p className={styles.fileName}>{value.name || "Uploaded File"}</p>
              {value.size && <p className={styles.fileSize}>{formatBytes(value.size)}</p>}
            </div>
          </div>
          <button
            type="button"
            className={styles.removeButton}
            onClick={handleRemove}
            aria-label="Remove file"
            disabled={disabled}
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      {displayError && <span className={styles.errorText}>{displayError}</span>}
    </div>
  );
};

export default FileUpload;
