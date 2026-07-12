import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "../Modal/Modal";
import { Input, Select, Textarea, DatePicker, Button } from "../index";

const completeTripSchema = z.object({
  completionDate: z.string().min(1, "Completion date is required"),
  finalOdometer: z.coerce.number().positive("Final odometer read must be positive"),
  fuelConsumed: z.coerce.number().nonnegative("Fuel consumed cannot be negative"),
  actualDistance: z.coerce.number().positive("Actual distance must be positive"),
  delayReason: z.string().optional(),
  notes: z.string().optional()
});

export const CompleteTripModal = ({ isOpen, onClose, onConfirm, trip }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(completeTripSchema),
    defaultValues: {
      completionDate: new Date().toISOString().split("T")[0],
      finalOdometer: "",
      fuelConsumed: "",
      actualDistance: trip?.plannedDistance || "",
      delayReason: "None",
      notes: ""
    }
  });

  const handleFormSubmit = (data) => {
    onConfirm(data);
  };

  const delayOptions = [
    { value: "None", label: "None (On-Time)" },
    { value: "Traffic Congestion", label: "Traffic Congestion" },
    { value: "Severe Weather", label: "Severe Weather" },
    { value: "Mechanical Issue", label: "Mechanical Issue" },
    { value: "Route Detour", label: "Route Detour" },
    { value: "Other Delay", label: "Other Delay" }
  ];

  if (!trip) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete Cargo Trip" size="sm">
      <form onSubmit={handleSubmit(handleFormSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
          Enter final trip parameters for trip <strong>{trip.id}</strong>.
        </p>

        <DatePicker
          label="Actual Completion Date"
          error={errors.completionDate?.message}
          {...register("completionDate")}
        />

        <Input
          label="Final Odometer Read (mi)"
          type="number"
          placeholder="e.g. 145440"
          error={errors.finalOdometer?.message}
          {...register("finalOdometer")}
        />

        <Input
          label="Actual Distance Traveled (mi)"
          type="number"
          placeholder="e.g. 240"
          error={errors.actualDistance?.message}
          {...register("actualDistance")}
        />

        <Input
          label="Fuel Consumed (Liters)"
          type="number"
          placeholder="e.g. 120"
          error={errors.fuelConsumed?.message}
          {...register("fuelConsumed")}
        />

        <Select
          label="Delay Classification"
          options={delayOptions}
          error={errors.delayReason?.message}
          {...register("delayReason")}
        />

        <Textarea
          label="Post-Trip Operational Remarks"
          placeholder="Log warehouse receiving sign-offs, customer feedback, toll tickets, or payloads remarks..."
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
            Complete Trip Order
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CompleteTripModal;
