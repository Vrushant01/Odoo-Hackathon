import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertCircle, AlertTriangle } from "lucide-react";
import vehicleService from "../../services/vehicleService";
import driverService from "../../services/driverService";
import { Input, Select, Textarea, DatePicker, Button } from "../index";

const tripFormSchema = z.object({
  source: z.string().min(1, "Origin point is required"),
  destination: z.string().min(1, "Destination point is required"),
  vehicle: z.string().min(1, "Vehicle assignment is required"),
  driver: z.string().min(1, "Driver assignment is required"),
  cargoDescription: z.string().min(1, "Cargo description is required"),
  cargoWeight: z.coerce.number().positive("Cargo weight must be positive"),
  plannedDistance: z.coerce.number().positive("Planned distance must be positive"),
  expectedDuration: z.coerce.number().positive("Expected duration must be positive"),
  priority: z.string().min(1, "Trip priority is required"),
  expectedCompletion: z.string().min(1, "Expected completion date is required"),
  notes: z.string().optional()
});

export const TripForm = ({ defaultValues, onSubmit, onCancel, isEdit = false }) => {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [activeVehicles, setActiveVehicles] = useState([]);
  const [activeDrivers, setActiveDrivers] = useState([]);
  
  const [selectedVehicleCapacity, setSelectedVehicleCapacity] = useState(0);
  const [cargoExceedsWarning, setCargoExceedsWarning] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(tripFormSchema),
    defaultValues: defaultValues || {
      source: "",
      destination: "",
      vehicle: "",
      driver: "",
      cargoDescription: "",
      cargoWeight: "",
      plannedDistance: "",
      expectedDuration: "",
      priority: "Medium",
      expectedCompletion: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      notes: ""
    }
  });

  // Fetch active vehicles & drivers
  useEffect(() => {
    const loadAssets = async () => {
      try {
        const [vehList, drvList] = await Promise.all([
          vehicleService.getVehicles(),
          driverService.getDrivers()
        ]);
        setActiveVehicles(vehList);
        setActiveDrivers(drvList);

        // Set initial capacity if edit mode
        if (defaultValues?.vehicle) {
          const matched = vehList.find(v => `${v.name} (${v.plateNumber})` === defaultValues.vehicle);
          if (matched) setSelectedVehicleCapacity(matched.loadCapacity);
        }
      } catch (err) {
        console.error("Failed to load transport assets:", err);
      }
    };
    loadAssets();
  }, [defaultValues]);

  // Watch vehicle & cargoWeight values
  const watchedVehicle = watch("vehicle");
  const watchedCargoWeight = watch("cargoWeight");

  useEffect(() => {
    if (watchedVehicle) {
      const matched = activeVehicles.find(v => `${v.name} (${v.plateNumber})` === watchedVehicle || v.id === watchedVehicle);
      if (matched) {
        setSelectedVehicleCapacity(matched.loadCapacity);
      }
    }
  }, [watchedVehicle, activeVehicles]);

  useEffect(() => {
    if (selectedVehicleCapacity > 0 && watchedCargoWeight) {
      setCargoExceedsWarning(Number(watchedCargoWeight) > selectedVehicleCapacity);
    } else {
      setCargoExceedsWarning(false);
    }
  }, [watchedCargoWeight, selectedVehicleCapacity]);

  const handleFormSubmit = async (data) => {
    setSubmitError("");
    setLoading(true);
    try {
      // Find full vehicle/driver strings to save in mock DB
      const vehMatched = activeVehicles.find(v => v.id === data.vehicle || `${v.name} (${v.plateNumber})` === data.vehicle);
      const drvMatched = activeDrivers.find(d => d.id === data.driver || d.name === data.driver);

      const payload = {
        ...data,
        vehicle: vehMatched ? `${vehMatched.name} (${vehMatched.plateNumber})` : data.vehicle,
        driver: drvMatched ? drvMatched.name : data.driver,
        vehicleCapacity: selectedVehicleCapacity
      };

      await onSubmit(payload);
    } catch (err) {
      setSubmitError(err.message || "Failed to save trip logs.");
    } finally {
      setLoading(false);
    }
  };

  const vehicleOptions = [
    { value: "", label: "Select vehicle..." },
    ...activeVehicles.map(v => ({ value: `${v.name} (${v.plateNumber})`, label: `${v.name} (${v.plateNumber}) [Max: ${v.loadCapacity.toLocaleString()} lbs] - ${v.status}` }))
  ];

  const driverOptions = [
    { value: "", label: "Select driver..." },
    ...activeDrivers.map(d => ({ value: d.name, label: `${d.name} (${d.licenseCategory}) - ${d.status}` }))
  ];

  const priorities = [
    { value: "Low", label: "Low Priority" },
    { value: "Medium", label: "Medium Priority" },
    { value: "High", label: "High Priority" }
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
          <Input label="Origin (Source)" placeholder="e.g. Houston, TX" error={errors.source?.message} disabled={loading} autoFocus {...register("source")} />
          
          <Input label="Destination" placeholder="e.g. Dallas, TX" error={errors.destination?.message} disabled={loading} {...register("destination")} />

          <Select label="Assign Vehicle" error={errors.vehicle?.message} options={vehicleOptions} disabled={loading} {...register("vehicle")} />

          <Select label="Assign Driver" error={errors.driver?.message} options={driverOptions} disabled={loading} {...register("driver")} />

          <Input label="Cargo Payload Description" placeholder="e.g. Industrial Generators" error={errors.cargoDescription?.message} disabled={loading} {...register("cargoDescription")} />

          <Input label="Cargo Payload Weight (lbs)" type="number" placeholder="e.g. 15000" error={errors.cargoWeight?.message} disabled={loading} {...register("cargoWeight")} />

          <Input label="Planned Distance (miles)" type="number" placeholder="e.g. 240" error={errors.plannedDistance?.message} disabled={loading} {...register("plannedDistance")} />

          <Input label="Expected Duration (hours)" type="number" step="0.1" placeholder="e.g. 5.5" error={errors.expectedDuration?.message} disabled={loading} {...register("expectedDuration")} />

          <Select label="Trip Priority" error={errors.priority?.message} options={priorities} disabled={loading} {...register("priority")} />

          <DatePicker label="Expected Completion Date" error={errors.expectedCompletion?.message} disabled={loading} {...register("expectedCompletion")} />
        </div>

        {selectedVehicleCapacity > 0 && (
          <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600, padding: "0.25rem 0" }}>
            Selected Vehicle Cargo Capacity Limit: <strong style={{ color: "var(--primary)" }}>{selectedVehicleCapacity.toLocaleString()} lbs</strong>
          </div>
        )}

        {cargoExceedsWarning && (
          <div style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            padding: "0.75rem 1rem",
            background: "var(--warning-light)",
            color: "var(--warning)",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.825rem",
            fontWeight: 600,
            border: "1px solid hsla(var(--warning-h), var(--warning-s), var(--warning-l), 0.2)"
          }}>
            <AlertTriangle size={16} />
            <span>Warning: Cargo payload weight exceeds the maximum load capacity of the assigned vehicle!</span>
          </div>
        )}

        <Textarea
          label="Trip Notes / Special Instructions"
          placeholder="Add details, route restrictions, delivery contact, or payload safety tags..."
          error={errors.notes?.message}
          disabled={loading}
          {...register("notes")}
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
          {isEdit ? "Save Changes" : "Create Trip Draft"}
        </Button>
      </div>
    </form>
  );
};

export default TripForm;
