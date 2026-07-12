import React from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ArrowLeft } from "lucide-react";
import Button from "../../components/Button/Button";
import styles from "./Login.module.css";

export const LockedAccount = () => {
  const navigate = useNavigate();

  const handleEmailSupport = () => {
    window.location.href = "mailto:support@transitops.com?subject=TransitOps%20Account%20Locked";
  };

  const handleReturnToLogin = () => {
    navigate("/login");
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.logoIcon} style={{ color: "var(--danger)", display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
            <Lock size={48} strokeWidth={2} />
          </div>
          <h2 className={styles.title}>Account Locked</h2>
          <p className={styles.subtitle} style={{ marginTop: "1rem", lineHeight: "1.5", fontSize: "0.95rem", color: "var(--text-primary)" }}>
            Your account has been locked after 5 unsuccessful login attempts.
          </p>
          <p className={styles.subtitle} style={{ marginTop: "0.5rem", color: "var(--text-secondary)" }}>
            Please contact your administrator.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1.5rem" }}>
          <Button variant="primary" fullWidth onClick={handleEmailSupport} startIcon={<Mail size={18} />}>
            Email Support
          </Button>
          <Button variant="outline" fullWidth onClick={handleReturnToLogin} startIcon={<ArrowLeft size={18} />}>
            Return to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LockedAccount;
