import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertCircle } from "lucide-react";
import { Input, Select, Textarea, DatePicker, Button } from "../index";

// Define validation schema
const vehicleFormSchema = z.object({
  plateNumber: z.string().min(1, "Registration number is required").toUpperCase(),
  name: z.string().min(1, "Vehicle name is required"),
  model: z.string().min(1, "Model is required"),
  type: z.string().min(1, "Asset type is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  year: z.coerce.number().int().min(1950, "Invalid year").max(new Date().getFullYear() + 1, "Cannot be future manufacturing year"),
  fuelType: z.string().min(1, "Fuel type is required"),
  loadCapacity: z.coerce.number().positive("Maximum load capacity must be positive"),
  odometer: z.coerce.number().nonnegative("Odometer cannot be negative"),
  cost: z.coerce.number().positive("Acquisition cost must be positive"),
  purchaseDate: z.string().min(1, "Purchase date is required").refine((val) => {
    const pDate = new Date(val);
    const today = new Date();
    return pDate <= today;
  }, { message: "Purchase date cannot be in the future" }),
  insuranceNumber: z.string().min(1, "Insurance number is required"),
  insuranceExpiry: z.string().min(1, "Insurance expiry date is required"),
  rcNumber: z.string().min(1, "RC number is required"),
  region: z.string().min(1, "Region hub is required"),
  status: z.string().min(1, "Current status is required"),
  notes: z.string().optional()
});

export const VehicleForm = ({ defaultValues, onSubmit, onCancel, isEdit = false }) => {
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  const isRetired = defaultValues?.status === "Retired";

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: defaultValues || {
      plateNumber: "",
      name: "",
      model: "",
      type: "Heavy Truck",
      manufacturer: "",
      year: new Date().getFullYear(),
      fuelType: "Diesel",
      loadCapacity: "",
      odometer: "",
      cost: "",
      purchaseDate: new Date().toISOString().split("T")[0],
      insuranceNumber: "",
      insuranceExpiry: "",
      rcNumber: "",
      region: "South",
      status: "Available",
      notes: ""
    }
  });

  const handleFormSubmit = async (data) => {
    setSubmitError("");
    setLoading(true);
    try {
      await onSubmit(data);
    } catch (err) {
      setSubmitError(err.message || "An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  const types = [
    { value: "Heavy Truck", label: "Heavy Truck" },
    { value: "Cargo Van", label: "Cargo Van" },
    { value: "Delivery Van", label: "Delivery Van" },
    { value: "Flatbed Trailer", label: "Flatbed Trailer" }
  ];

  const fuelTypes = [
    { value: "Diesel", label: "Diesel" },
    { value: "Gasoline", label: "Gasoline" },
    { value: "Electric", label: "Electric" },
    { value: "Hybrid", label: "Hybrid" }
  ];

  const regions = [
    { value: "South", label: "South Region" },
    { value: "West", label: "West Region" },
    { value: "East", label: "East Region" },
    { value: "North", label: "North Region" }
  ];

  const statuses = [
    { value: "Available", label: "Available" },
    { value: "On Trip", label: "On Trip" },
    { value: "In Shop", label: "In Shop (Maintenance)" },
    { value: "Retired", label: "Retired" }
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
        {isRetired && (
          <div style={{
            padding: "0.75rem 1rem",
            background: "var(--bg-tertiary)",
            color: "var(--text-secondary)",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.85rem",
            fontWeight: 600,
            textAlign: "center",
            border: "1px solid var(--border-color)",
            marginBottom: "0.5rem"
          }}>
            This vehicle is retired. Editing is disabled.
          </div>
        )}

        {/* Inputs Grid Layout */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          paddingRight: "0.25rem",
          paddingBottom: "0.5rem"
        }}>
          {/* Registration Number */}
          <Input
            label="Registration Number (Plate)"
            placeholder="e.g. TX-9082"
            error={errors.plateNumber?.message}
            disabled={loading || isRetired || (isEdit && isRetired)}
            autoFocus
            {...register("plateNumber")}
          />

          {/* Vehicle Name */}
          <Input
            label="Vehicle Name"
            placeholder="e.g. Freightliner Cascadia"
            error={errors.name?.message}
            disabled={loading || isRetired}
            {...register("name")}
          />

          {/* Model */}
          <Input
            label="Vehicle Model"
            placeholder="e.g. Cascadia"
            error={errors.model?.message}
            disabled={loading || isRetired}
            {...register("model")}
          />

          {/* Manufacturer */}
          <Input
            label="Manufacturer"
            placeholder="e.g. Freightliner"
            error={errors.manufacturer?.message}
            disabled={loading || isRetired}
            {...register("manufacturer")}
          />

          {/* Manufacturing Year */}
          <Input
            label="Manufacturing Year"
            type="number"
            placeholder="e.g. 2022"
            error={errors.year?.message}
            disabled={loading || isRetired}
            {...register("year")}
          />

          {/* Vehicle Type */}
          <Select
            label="Asset Type"
            error={errors.type?.message}
            options={types}
            disabled={loading || isRetired}
            {...register("type")}
          />

          {/* Fuel Type */}
          <Select
            label="Fuel Type"
            error={errors.fuelType?.message}
            options={fuelTypes}
            disabled={loading || isRetired}
            {...register("fuelType")}
          />

          {/* Load Capacity */}
          <Input
            label="Max Load Capacity (lbs)"
            type="number"
            placeholder="e.g. 45000"
            error={errors.loadCapacity?.message}
            disabled={loading || isRetired}
            {...register("loadCapacity")}
          />

          {/* Current Odometer */}
          <Input
            label="Current Odometer (miles)"
            type="number"
            placeholder="e.g. 145000"
            error={errors.odometer?.message}
            disabled={loading || isRetired}
            {...register("odometer")}
          />

          {/* Acquisition Cost */}
          <Input
            label="Acquisition Cost (USD)"
            type="number"
            placeholder="e.g. 135000"
            error={errors.cost?.message}
            disabled={loading || isRetired}
            {...register("cost")}
          />

          {/* Purchase Date */}
          <DatePicker
            label="Purchase Date"
            error={errors.purchaseDate?.message}
            disabled={loading || isRetired}
            {...register("purchaseDate")}
          />

          {/* Region */}
          <Select
            label="Region Hub"
            error={errors.region?.message}
            options={regions}
            disabled={loading || isRetired}
            {...register("region")}
          />

          {/* Insurance Number */}
          <Input
            label="Insurance Policy Number"
            placeholder="e.g. INS-TX-98127"
            error={errors.insuranceNumber?.message}
            disabled={loading || isRetired}
            {...register("insuranceNumber")}
          />

          {/* Insurance Expiry */}
          <DatePicker
            label="Insurance Expiration"
            error={errors.insuranceExpiry?.message}
            disabled={loading || isRetired}
            {...register("insuranceExpiry")}
          />

          {/* RC Number */}
          <Input
            label="RC Registration Code"
            placeholder="e.g. RC-TX-88271A"
            error={errors.rcNumber?.message}
            disabled={loading || isRetired}
            {...register("rcNumber")}
          />

          {/* Status */}
          <Select
            label="Asset Status"
            error={errors.status?.message}
            options={statuses}
            disabled={loading || isRetired}
            {...register("status")}
          />
        </div>

        {/* Notes */}
        <Textarea
          label="Operational Notes"
          placeholder="Add details, maintenance remarks, or special equipment specs..."
          error={errors.notes?.message}
          disabled={loading || isRetired}
          {...register("notes")}
        />
      </div>

      {/* Form Buttons (Sticky Footer) */}
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
        {!isRetired && (
          <Button type="submit" variant="primary" loading={loading}>
            {isEdit ? "Save Changes" : "Register Vehicle"}
          </Button>
        )}
      </div>
    </form>
  );
};

export default VehicleForm;
