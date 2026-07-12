import React from "react";
import { AlertTriangle, Info, HelpCircle } from "lucide-react";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";

export const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to perform this action?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger", // 'danger' | 'warning' | 'info'
  loading = false
}) => {
  const getIcon = () => {
    switch (variant) {
      case "danger":
        return <AlertTriangle size={32} style={{ color: "var(--danger)" }} />;
      case "warning":
        return <AlertTriangle size={32} style={{ color: "var(--warning)" }} />;
      case "info":
        return <Info size={32} style={{ color: "var(--info)" }} />;
      default:
        return <HelpCircle size={32} style={{ color: "var(--primary)" }} />;
    }
  };

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose} disabled={loading}>
        {cancelLabel}
      </Button>
      <Button
        variant={variant === "danger" ? "danger" : "primary"}
        onClick={onConfirm}
        loading={loading}
      >
        {confirmLabel}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
      size="sm"
      closeOnBackdropClick={!loading}
    >
      <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
        <div style={{ flexShrink: 0 }}>{getIcon()}</div>
        <div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.5" }}>
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;
