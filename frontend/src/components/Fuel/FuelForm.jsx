import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertCircle } from "lucide-react";
import vehicleService from "../../services/vehicleService";
import driverService from "../../services/driverService";
import tripService from "../../services/tripService";
import { Input, Select, Textarea, DatePicker, Button } from "../index";

const fuelFormSchema = z.object({
  vehicle: z.string().min(1, "Vehicle assignment is required"),
  driver: z.string().min(1, "Driver assignment is required"),
  tripId: z.string().min(1, "Trip ID is required"),
  fuelStation: z.string().min(1, "Fuel station is required"),
  fuelType: z.string().min(1, "Fuel type is required"),
  fuelQuantity: z.coerce.number().positive("Quantity must be positive"),
  pricePerUnit: z.coerce.number().positive("Price per unit must be positive"),
  currentOdometer: z.coerce.number().positive("Current odometer read must be positive"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  fuelDate: z.string().min(1, "Fuel date is required"),
  remarks: z.string().optional()
});

export const FuelForm = ({ defaultValues, onSubmit, onCancel, isEdit = false }) => {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [activeVehicles, setActiveVehicles] = useState([]);
  const [activeDrivers, setActiveDrivers] = useState([]);
  const [activeTrips, setActiveTrips] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(fuelFormSchema),
    defaultValues: defaultValues || {
      vehicle: "",
      driver: "",
      tripId: "",
      fuelStation: "",
      fuelType: "Diesel",
      fuelQuantity: "",
      pricePerUnit: "",
      currentOdometer: "",
      invoiceNumber: "",
      paymentMethod: "Card",
      fuelDate: new Date().toISOString().split("T")[0],
      remarks: ""
    }
  });

  // Fetch active assets on mount
  useEffect(() => {
    const loadAssets = async () => {
      try {
        const [vehList, drvList, tripList] = await Promise.all([
          vehicleService.getVehicles(),
          driverService.getDrivers(),
          tripService.getTrips()
        ]);
        setActiveVehicles(vehList);
        setActiveDrivers(drvList);
        setActiveTrips(tripList);
      } catch (err) {
        console.error("Failed to load assets:", err);
      }
    };
    loadAssets();
  }, []);

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

  const fuelTypes = [
    { value: "Diesel", label: "Diesel" },
    { value: "Petrol", label: "Petrol" },
    { value: "CNG", label: "CNG" },
    { value: "Electric", label: "Electric" },
    { value: "Hybrid", label: "Hybrid" },
    { value: "Other", label: "Other" }
  ];

  const paymentMethods = [
    { value: "Cash", label: "Cash" },
    { value: "Card", label: "Card" },
    { value: "UPI", label: "UPI" },
    { value: "Bank Transfer", label: "Bank Transfer" },
    { value: "Credit", label: "Credit" },
    { value: "Other", label: "Other" }
  ];

  const vehicleOptions = [
    { value: "", label: "Select vehicle..." },
    ...activeVehicles.map(v => ({ value: `${v.name} (${v.plateNumber})`, label: `${v.name} (${v.plateNumber})` }))
  ];

  const driverOptions = [
    { value: "", label: "Select driver..." },
    ...activeDrivers.map(d => ({ value: d.name, label: d.name }))
  ];

  const tripOptions = [
    { value: "", label: "Select trip..." },
    ...activeTrips.map(t => ({ value: t.id, label: `${t.id} [${t.source} ➜ ${t.destination}]` }))
  ];

  const qty = watch("fuelQuantity");
  const price = watch("pricePerUnit");
  const calculatedTotal = (qty && price) ? (qty * price).toFixed(2) : "0.00";

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
          border: "1px solid hsla(var(--danger-h), var(--danger-s), var(--danger-l), 0.2)"
        }}>
          <AlertCircle size={16} />
          <span>{submitError}</span>
        </div>
      )}

      {/* Grid Fields */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "1rem",
        maxHeight: "55vh",
        overflowY: "auto",
        paddingRight: "0.25rem",
        paddingBottom: "0.5rem"
      }}>
        <Select label="Refueling Vehicle" error={errors.vehicle?.message} options={vehicleOptions} disabled={loading} {...register("vehicle")} />

        <Select label="Refueling Driver" error={errors.driver?.message} options={driverOptions} disabled={loading} {...register("driver")} />

        <Select label="Trip ID" error={errors.tripId?.message} options={tripOptions} disabled={loading} {...register("tripId")} />

        <Input label="Fuel Station Name" placeholder="e.g. Shell Station #4, Miami" error={errors.fuelStation?.message} disabled={loading} {...register("fuelStation")} />

        <Select label="Fuel Category Type" error={errors.fuelType?.message} options={fuelTypes} disabled={loading} {...register("fuelType")} />

        <Input label="Fuel Quantity (Liters)" type="number" placeholder="e.g. 65" error={errors.fuelQuantity?.message} disabled={loading} {...register("fuelQuantity")} />

        <Input label="Price Per Liter ($)" type="number" step="0.01" placeholder="e.g. 1.36" error={errors.pricePerUnit?.message} disabled={loading} {...register("pricePerUnit")} />

        <Input label="Current Odometer Read (mi)" type="number" placeholder="e.g. 112065" error={errors.currentOdometer?.message} disabled={loading} {...register("currentOdometer")} />

        <Input label="Receipt / Invoice Number" placeholder="e.g. INV-FL-1001" error={errors.invoiceNumber?.message} disabled={loading} {...register("invoiceNumber")} />

        <Select label="Invoice Payment Method" error={errors.paymentMethod?.message} options={paymentMethods} disabled={loading} {...register("paymentMethod")} />

        <DatePicker label="Refuel Date" error={errors.fuelDate?.message} disabled={loading} {...register("fuelDate")} />
      </div>

      <div style={{ fontSize: "0.95rem", color: "var(--text-secondary)", fontWeight: 700, padding: "0.25rem 0" }}>
        Total Calculated Amount: <strong style={{ color: "var(--success)", fontSize: "1.1rem" }}>${calculatedTotal}</strong>
      </div>

      <Textarea
        label="Refueling Remarks"
        placeholder="Add remarks like fuel card details, tank levels issues, or gateway receipts codes..."
        error={errors.remarks?.message}
        disabled={loading}
        {...register("remarks")}
      />

      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: "0.75rem",
        borderTop: "1px solid var(--border-color)",
        paddingTop: "1rem",
        marginTop: "0.5rem"
      }}>
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {isEdit ? "Save Changes" : "Log Refueling"}
        </Button>
      </div>
    </form>
  );
};

export default FuelForm;
