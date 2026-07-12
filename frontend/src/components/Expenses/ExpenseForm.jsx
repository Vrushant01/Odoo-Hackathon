import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertCircle } from "lucide-react";
import vehicleService from "../../services/vehicleService";
import tripService from "../../services/tripService";
import { Input, Select, Textarea, DatePicker, Button } from "../index";

const expenseFormSchema = z.object({
  vehicle: z.string().min(1, "Vehicle assignment is required"),
  tripId: z.string().min(1, "Trip ID is required"),
  type: z.string().min(1, "Expense type is required"),
  vendor: z.string().min(1, "Vendor name is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  status: z.string().min(1, "Payment status is required"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  expenseDate: z.string().min(1, "Expense date is required"),
  remarks: z.string().optional()
});

export const ExpenseForm = ({ defaultValues, onSubmit, onCancel, isEdit = false }) => {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [activeVehicles, setActiveVehicles] = useState([]);
  const [activeTrips, setActiveTrips] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: defaultValues || {
      vehicle: "",
      tripId: "",
      type: "Fuel",
      vendor: "",
      amount: "",
      paymentMethod: "Card",
      status: "Paid",
      invoiceNumber: "",
      expenseDate: new Date().toISOString().split("T")[0],
      remarks: ""
    }
  });

  // Fetch active assets on mount
  useEffect(() => {
    const loadAssets = async () => {
      try {
        const [vehList, tripList] = await Promise.all([
          vehicleService.getVehicles(),
          tripService.getTrips()
        ]);
        setActiveVehicles(vehList);
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

  const expenseTypes = [
    { value: "Fuel", label: "Fuel" },
    { value: "Maintenance", label: "Maintenance" },
    { value: "Repair", label: "Repair" },
    { value: "Toll", label: "Toll" },
    { value: "Insurance", label: "Insurance" },
    { value: "Parking", label: "Parking" },
    { value: "Tyre", label: "Tyre" },
    { value: "Battery", label: "Battery" },
    { value: "Cleaning", label: "Cleaning" },
    { value: "Permit", label: "Permit" },
    { value: "Fine", label: "Fine" },
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

  const paymentStatuses = [
    { value: "Paid", label: "Paid" },
    { value: "Pending", label: "Pending" },
    { value: "Cancelled", label: "Cancelled" }
  ];

  const vehicleOptions = [
    { value: "", label: "Select vehicle..." },
    ...activeVehicles.map(v => ({ value: `${v.name} (${v.plateNumber})`, label: `${v.name} (${v.plateNumber})` }))
  ];

  const tripOptions = [
    { value: "", label: "Select trip..." },
    ...activeTrips.map(t => ({ value: t.id, label: `${t.id} [${t.source} ➜ ${t.destination}]` }))
  ];

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
        <Select label="Expense Vehicle Unit" error={errors.vehicle?.message} options={vehicleOptions} disabled={loading} {...register("vehicle")} />

        <Select label="Associated Trip ID" error={errors.tripId?.message} options={tripOptions} disabled={loading} {...register("tripId")} />

        <Select label="Expense Category Type" error={errors.type?.message} options={expenseTypes} disabled={loading} {...register("type")} />

        <Input label="Billing Vendor Name" placeholder="e.g. Shell Inc, Tolls authority" error={errors.vendor?.message} disabled={loading} {...register("vendor")} />

        <Input label="Invoice Billing Amount ($)" type="number" step="0.01" placeholder="e.g. 88.40" error={errors.amount?.message} disabled={loading} {...register("amount")} />

        <Select label="Invoice Payment Method" error={errors.paymentMethod?.message} options={paymentMethods} disabled={loading} {...register("paymentMethod")} />

        <Select label="Payment Invoice Status" error={errors.status?.message} options={paymentStatuses} disabled={loading} {...register("status")} />

        <Input label="Receipt / Invoice Number" placeholder="e.g. INV-EXP-1001" error={errors.invoiceNumber?.message} disabled={loading} {...register("invoiceNumber")} />

        <DatePicker label="Billing Expense Date" error={errors.expenseDate?.message} disabled={loading} {...register("expenseDate")} />
      </div>

      <Textarea
        label="Expense Billing Remarks"
        placeholder="Add remarks like disputed claims logs, toll card receipts verification, or audit notes..."
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
          {isEdit ? "Save Changes" : "Record Expense"}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;
