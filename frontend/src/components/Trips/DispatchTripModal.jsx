import React, { useState } from "react";
import Modal from "../Modal/Modal";
import { Input, Textarea, Button } from "../index";

export const DispatchTripModal = ({ isOpen, onClose, onConfirm, trip }) => {
  const [dispatchDate, setDispatchDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");

  const handleConfirm = () => {
    onConfirm({ dispatchDate, notes });
  };

  if (!trip) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Dispatch Cargo Trip" size="sm">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
          Confirm dispatch checklist for trip <strong style={{ color: "var(--primary)" }}>{trip.id}</strong>.
        </p>

        {/* Dispatch Checklist Summary */}
        <div className="glass-panel" style={{
          padding: "1rem",
          borderRadius: "var(--radius-sm)",
          fontSize: "0.85rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          border: "1px solid var(--border-color)"
        }}>
          <div>Origin: <strong>{trip.source}</strong> ➜ Destination: <strong>{trip.destination}</strong></div>
          <div>Payload: <strong>{trip.cargoDescription} ({trip.cargoWeight?.toLocaleString()} lbs)</strong></div>
          <div>Driver: <strong>{trip.driver}</strong></div>
          <div>Vehicle: <strong>{trip.vehicle}</strong></div>
          <div>Planned Route Distance: <strong>{trip.plannedDistance} miles</strong></div>
        </div>

        <Input
          label="Actual Dispatch Date"
          type="date"
          value={dispatchDate}
          onChange={(e) => setDispatchDate(e.target.value)}
        />

        <Textarea
          label="Dispatch Remarks / Gate Pass Notes"
          placeholder="Enter dispatcher notes, toll card codes, or security gate numbers..."
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
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Authorize Dispatch
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DispatchTripModal;
