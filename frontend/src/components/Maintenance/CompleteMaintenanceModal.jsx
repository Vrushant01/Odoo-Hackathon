import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "../Modal/Modal";
import { Input, Textarea, DatePicker, Button } from "../index";

const completeMaintSchema = z.object({
  completionDate: z.string().min(1, "Completion date is required"),
  finalCost: z.coerce.number().nonnegative("Final cost cannot be negative"),
  partsUsed: z.string().min(1, "Spare parts details are required"),
  finalOdometer: z.coerce.number().positive("Final odometer read must be positive"),
  notes: z.string().optional()
});

export const CompleteMaintenanceModal = ({ isOpen, onClose, onConfirm, record }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(completeMaintSchema),
    defaultValues: {
      completionDate: new Date().toISOString().split("T")[0],
      finalCost: record?.cost || "",
      partsUsed: record?.partsRequired || "",
      finalOdometer: "",
      notes: ""
    }
  });

  const handleFormSubmit = (data) => {
    onConfirm(data);
  };

  if (!record) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete Maintenance Service" size="sm">
      <form onSubmit={handleSubmit(handleFormSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
          Enter final servicing records for worksheet <strong style={{ color: "var(--primary)" }}>{record.id}</strong>.
        </p>

        <DatePicker
          label="Actual Completion Date"
          error={errors.completionDate?.message}
          {...register("completionDate")}
        />

        <Input
          label="Final Odometer Read (mi)"
          type="number"
          placeholder="e.g. 68420"
          error={errors.finalOdometer?.message}
          {...register("finalOdometer")}
        />

        <Input
          label="Final Maintenance Cost (USD)"
          type="number"
          placeholder="e.g. 450"
          error={errors.finalCost?.message}
          {...register("finalCost")}
        />

        <Input
          label="Spare Parts Used (Comma Separated)"
          placeholder="e.g. Brake pads, Brake rotors"
          error={errors.partsUsed?.message}
          {...register("partsUsed")}
        />

        <Textarea
          label="Detailed Service Notes"
          placeholder="Log repairs completed, mechanics inspections reports, or post-servicing guidelines..."
          error={errors.notes?.message}
          {...register("notes")}
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
          <Button type="submit" variant="success">
            Complete Servicing
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CompleteMaintenanceModal;
