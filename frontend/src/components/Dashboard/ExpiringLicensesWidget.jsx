import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, Send } from "lucide-react";
import { toast } from "sonner";
import Card from "../Card/Card";
import Button from "../Button/Button";
import StatusBadge from "../StatusBadge/StatusBadge";

export const ExpiringLicensesWidget = ({ expiringDrivers }) => {
  const navigate = useNavigate();

  const handleNotify = (name) => {
    toast.success(`Renewal notification dispatched to ${name}!`);
  };

  const handleRenewRedirect = (id) => {
    navigate(`/drivers?id=${id}&action=edit`);
  };

  return (
    <Card
      title="License Compliance"
      subtitle="Driver licenses nearing expiration"
      headerAction={<ShieldAlert size={18} style={{ color: "var(--danger)" }} />}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
              <th style={{ padding: "0.5rem 0.25rem", fontWeight: 700 }}>Driver</th>
              <th style={{ padding: "0.5rem 0.25rem", fontWeight: 700 }}>License</th>
              <th style={{ padding: "0.5rem 0.25rem", fontWeight: 700 }}>Expiry</th>
              <th style={{ padding: "0.5rem 0.25rem", fontWeight: 700 }}>Days</th>
              <th style={{ padding: "0.5rem 0.25rem", fontWeight: 700 }}>Status</th>
              <th style={{ padding: "0.5rem 0.25rem", fontWeight: 700, textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {!expiringDrivers || expiringDrivers.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-muted)" }}>
                  All operators are fully licensed.
                </td>
              </tr>
            ) : (
              expiringDrivers.map((drv) => (
                <tr key={drv.id} style={{ borderBottom: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
                  <td style={{ padding: "0.75rem 0.25rem", fontWeight: 600 }}>{drv.name}</td>
                  <td style={{ padding: "0.75rem 0.25rem", fontFamily: "monospace" }}>{drv.license}</td>
                  <td style={{ padding: "0.75rem 0.25rem" }}>{drv.expiryDate}</td>
                  <td style={{ padding: "0.75rem 0.25rem", fontWeight: 700 }}>{drv.daysRemaining}d</td>
                  <td style={{ padding: "0.75rem 0.25rem" }}>
                    <StatusBadge status={drv.status} variant={drv.status === "Critical" ? "danger" : "warning"} />
                  </td>
                  <td style={{ padding: "0.75rem 0.25rem", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "0.25rem", justifyContent: "flex-end" }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleNotify(drv.name)}
                        style={{ padding: "0.25rem", display: "inline-flex" }}
                        title="Send Notification"
                      >
                        <Send size={12} />
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleRenewRedirect(drv.id)}
                        style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
                      >
                        Renew
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ExpiringLicensesWidget;
