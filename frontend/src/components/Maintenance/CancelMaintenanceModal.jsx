import React, { useState } from "react";
import Modal from "../Modal/Modal";
import { Select, Textarea, Button } from "../index";

export const CancelMaintenanceModal = ({ isOpen, onClose, onConfirm, record }) => {
  const [reason, setReason] = useState("Parts Unavailable");
  const [notes, setNotes] = useState("");

  const handleConfirm = () => {
    onConfirm({ reason, notes });
  };

  const cancelReasons = [
    { value: "Parts Unavailable", label: "Parts Unavailable" },
    { value: "Mechanic Rescheduled", label: "Mechanic Rescheduled" },
    { value: "Vehicle Decommissioned", label: "Vehicle Decommissioned" },
    { value: "Client Cancelled Check", label: "Client Cancelled Check" },
    { value: "Other", label: "Other Administrative Reason" }
  ];

  if (!record) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cancel Servicing Task" size="sm">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
          Specify cancellation reasons for worksheet order <strong style={{ color: "var(--danger)" }}>{record.id}</strong>.
        </p>

        <Select
          label="Cancellation Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          options={cancelReasons}
        />

        <Textarea
          label="Detailed Cancellation Remarks"
          placeholder="Log rescheduling notes, alternative workshop options, or parts delays info..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "0.75rem",
          borderTop: "1px solid var(--border-color)",
          paddingTop: "1.0rem"
        }}>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleConfirm}>
            Cancel Servicing
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CancelMaintenanceModal;
