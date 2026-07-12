import React, { useState } from "react";
import Modal from "../Modal/Modal";
import { Select, Textarea, Button } from "../index";

export const CancelTripModal = ({ isOpen, onClose, onConfirm, trip }) => {
  const [reason, setReason] = useState("Mechanical Breakdown");
  const [notes, setNotes] = useState("");

  const handleConfirm = () => {
    onConfirm({ reason, notes });
  };

  const cancelReasons = [
    { value: "Mechanical Breakdown", label: "Mechanical Breakdown" },
    { value: "Refrigeration Unit Malfunction", label: "Refrigeration Unit Malfunction" },
    { value: "Driver Illness", label: "Driver Illness" },
    { value: "Severe Weather Grounding", label: "Severe Weather Grounding" },
    { value: "Customer Order Cancelled", label: "Customer Order Cancelled" },
    { value: "Other", label: "Other Logistics Reason" }
  ];

  if (!trip) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cancel Trip Dispatch" size="sm">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
          Provide cancellation reasons for trip order <strong style={{ color: "var(--danger)" }}>{trip.id}</strong>.
        </p>

        <Select
          label="Cancellation Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          options={cancelReasons}
        />

        <Textarea
          label="Detailed Cancellation Remarks"
          placeholder="Log incident reports, breakdown locations, towing services details, or dispatch re-schedules codes..."
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
            Cancel Trip Order
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CancelTripModal;
