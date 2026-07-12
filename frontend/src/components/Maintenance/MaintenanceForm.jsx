import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertCircle } from "lucide-react";
import vehicleService from "../../services/vehicleService";
import { Input, Select, Textarea, DatePicker, Button } from "../index";

const maintenanceFormSchema = z.object({
  vehicle: z.string().min(1, "Vehicle assignment is required"),
  type: z.string().min(1, "Maintenance type is required"),
  category: z.string().min(1, "Category is required"),
  priority: z.string().min(1, "Priority is required"),
  workshop: z.string().min(1, "Workshop center is required"),
  mechanic: z.string().min(1, "Assigned mechanic is required"),
  scheduledDate: z.string().min(1, "Scheduled date is required"),
  estimatedCompletion: z.string().min(1, "Estimated completion is required"),
  cost: z.coerce.number().nonnegative("Estimated cost cannot be negative"),
  description: z.string().min(1, "Service description is required"),
  partsRequired: z.string().optional(),
  remarks: z.string().optional()
});

export const MaintenanceForm = ({ defaultValues, onSubmit, onCancel, isEdit = false }) => {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [activeVehicles, setActiveVehicles] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: defaultValues || {
      vehicle: "",
      type: "Oil Change",
      category: "Preventive",
      priority: "Medium",
      workshop: "",
      mechanic: "",
      scheduledDate: new Date().toISOString().split("T")[0],
      estimatedCompletion: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      cost: "",
      description: "",
      partsRequired: "",
      remarks: ""
    }
  });

  // Fetch active vehicles list
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const list = await vehicleService.getVehicles();
        setActiveVehicles(list);
      } catch (err) {
        console.error("Failed to load vehicle list:", err);
      }
    };
    loadVehicles();
  }, []);

  const handleFormSubmit = async (data) => {
    setSubmitError("");
    setLoading(true);
    try {
      const matched = activeVehicles.find(v => v.id === data.vehicle || `${v.name} (${v.plateNumber})` === data.vehicle);
      const payload = {
        ...data,
        vehicle: matched ? `${matched.name} (${matched.plateNumber})` : data.vehicle,
        plateNumber: matched ? matched.plateNumber : ""
      };
      await onSubmit(payload);
    } catch (err) {
      setSubmitError(err.message || "An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  const types = [
    { value: "Oil Change", label: "Oil Change" },
    { value: "Engine Service", label: "Engine Service" },
    { value: "Brake Service", label: "Brake Service" },
    { value: "Tyre Replacement", label: "Tyre Replacement" },
    { value: "Battery Replacement", label: "Battery Replacement" },
    { value: "General Inspection", label: "General Inspection" },
    { value: "Insurance Renewal", label: "Insurance Renewal" },
    { value: "Fitness Certificate", label: "Fitness Certificate" },
    { value: "Pollution Check", label: "Pollution Check" },
    { value: "Custom", label: "Custom Service" }
  ];

  const categories = [
    { value: "Preventive", label: "Preventive" },
    { value: "Corrective", label: "Corrective" },
    { value: "Breakdown", label: "Breakdown" }
  ];

  const priorities = [
    { value: "Low", label: "Low Priority" },
    { value: "Medium", label: "Medium Priority" },
    { value: "High", label: "High Priority" },
    { value: "Critical", label: "Critical Priority" }
  ];

  const vehicleOptions = [
    { value: "", label: "Select vehicle..." },
    ...activeVehicles.map(v => ({ value: `${v.name} (${v.plateNumber})`, label: `${v.name} (${v.plateNumber}) - ${v.status}` }))
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} style={{ display: "flex", flexDirection: "column", height: "100%", maxHeight: "calc(90vh - 160px)", overflow: "hidden" }}>
      {submitError && (
        <div style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          padding: "0.75rem 1rem",
          background: "var(--danger-light)",
          color: "var(--danger)",
          borderRadius: "var(--radius-sm)",
          fontSize: "0.875rem",
          fontWeight: 600,
          border: "1px solid hsla(var(--danger-h), var(--danger-s), var(--danger-l), 0.2)",
          marginBottom: "0.5rem"
        }}>
          <AlertCircle size={16} />
          <span>{submitError}</span>
        </div>
      )}

      {/* Scrollable Form Body */}
      <div style={{ flex: 1, overflowY: "auto", paddingRight: "0.5rem", paddingBottom: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          paddingRight: "0.25rem",
          paddingBottom: "0.5rem"
        }}>
          <Select label="Select Vehicle" error={errors.vehicle?.message} options={vehicleOptions} disabled={loading} autoFocus {...register("vehicle")} />

          <Select label="Maintenance Type" error={errors.type?.message} options={types} disabled={loading} {...register("type")} />

          <Select label="Classification Category" error={errors.category?.message} options={categories} disabled={loading} {...register("category")} />

          <Select label="Priority Urgency" error={errors.priority?.message} options={priorities} disabled={loading} {...register("priority")} />

          <Input label="Workshop Center Name" placeholder="e.g. West Coast Fleet Hub" error={errors.workshop?.message} disabled={loading} {...register("workshop")} />

          <Input label="Assigned Mechanic" placeholder="e.g. Alex Rover" error={errors.mechanic?.message} disabled={loading} {...register("mechanic")} />

          <DatePicker label="Scheduled Start Date" error={errors.scheduledDate?.message} disabled={loading} {...register("scheduledDate")} />

          <DatePicker label="Estimated Completion Date" error={errors.estimatedCompletion?.message} disabled={loading} {...register("estimatedCompletion")} />

          <Input label="Estimated Cost (USD)" type="number" placeholder="e.g. 350" error={errors.cost?.message} disabled={loading} {...register("cost")} />

          <Input label="Spare Parts Required (Comma Separated)" placeholder="e.g. Brake pads, Oil filters" error={errors.partsRequired?.message} disabled={loading} {...register("partsRequired")} />
        </div>

        <Textarea
          label="Service Diagnostic / Failure Description"
          placeholder="Provide diagnostic codes, failure reports, or scheduled servicing goals..."
          error={errors.description?.message}
          disabled={loading}
          {...register("description")}
        />

        <Textarea
          label="Operator / Administrative Remarks"
          placeholder="Enter additional remarks, dispatch rules overrides, or compliance notes..."
          error={errors.remarks?.message}
          disabled={loading}
          {...register("remarks")}
        />
      </div>

      {/* Action Buttons (Sticky Footer) */}
      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: "0.75rem",
        borderTop: "1px solid var(--border-color)",
        paddingTop: "1rem",
        marginTop: "auto"
      }}>
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {isEdit ? "Save Changes" : "Schedule Maintenance"}
        </Button>
      </div>
    </form>
  );
};

export default MaintenanceForm;
