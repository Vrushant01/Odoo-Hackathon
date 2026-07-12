import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertCircle, Camera } from "lucide-react";
import { Input, Select, Textarea, DatePicker, Button } from "../index";

const driverFormSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  phone: z.string().min(1, "Phone number is required"),
  emergencyContact: z.string().min(1, "Emergency contact details are required"),
  licenseNumber: z.string().min(1, "License number is required").toUpperCase(),
  licenseCategory: z.string().min(1, "License category is required"),
  licenseExpiry: z.string().min(1, "License expiry date is required"),
  dob: z.string().min(1, "Date of birth is required"),
  address: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  joiningDate: z.string().min(1, "Joining date is required"),
  experience: z.coerce.number().nonnegative("Experience cannot be negative"),
  bloodGroup: z.string().min(1, "Blood group is required"),
  status: z.string().min(1, "Current status is required"),
  notes: z.string().optional()
});

export const DriverForm = ({ defaultValues, onSubmit, onCancel, isEdit = false }) => {
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(defaultValues?.avatar || "");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: zodResolver(driverFormSchema),
    defaultValues: defaultValues || {
      name: "",
      email: "",
      phone: "",
      emergencyContact: "",
      licenseNumber: "",
      licenseCategory: "Class A CDL",
      licenseExpiry: "",
      dob: "",
      address: "",
      city: "",
      state: "",
      country: "USA",
      joiningDate: new Date().toISOString().split("T")[0],
      experience: "",
      bloodGroup: "O+",
      status: "Available",
      notes: ""
    }
  });

  const handleFormSubmit = async (data) => {
    setSubmitError("");
    setLoading(true);
    try {
      await onSubmit({ ...data, avatar: avatarPreview });
    } catch (err) {
      setSubmitError(err.message || "An error occurred while saving profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const categories = [
    { value: "Class A CDL", label: "Class A CDL (Heavy Trucks)" },
    { value: "Class B CDL", label: "Class B CDL (Buses/Vans)" },
    { value: "Class C CDL", label: "Class C CDL (Standard Commercial)" }
  ];

  const bloodGroups = [
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" }
  ];

  const statuses = [
    { value: "Available", label: "Available" },
    { value: "On Trip", label: "On Trip" },
    { value: "Off Duty", label: "Off Duty" },
    { value: "Suspended", label: "Suspended" },
    { value: "License Expired", label: "License Expired" }
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
        {/* Profile Photo Uploader Row */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
          <div style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "2px solid var(--primary)",
            background: "var(--bg-tertiary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative"
          }}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <Camera size={24} style={{ color: "var(--text-muted)" }} />
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>Profile Avatar</span>
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("avatar-upload").click()}
            >
              Upload Photo
            </Button>
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          paddingRight: "0.25rem",
          paddingBottom: "0.5rem"
        }}>
          <Input label="Full Name" placeholder="e.g. John Doe" error={errors.name?.message} disabled={loading} autoFocus {...register("name")} />
          
          <Input label="Email Address" placeholder="e.g. john.doe@transitops.com" error={errors.email?.message} disabled={loading} {...register("email")} />

          <Input label="Phone Number" placeholder="e.g. +1 (555) 123-4567" error={errors.phone?.message} disabled={loading} {...register("phone")} />

          <Input label="Emergency Contact Details" placeholder="e.g. Spouse (+1 555-987-6543)" error={errors.emergencyContact?.message} disabled={loading} {...register("emergencyContact")} />

          <Input label="License Number" placeholder="e.g. DL-CA63524" error={errors.licenseNumber?.message} disabled={loading} {...register("licenseNumber")} />

          <Select label="License Category" error={errors.licenseCategory?.message} options={categories} disabled={loading} {...register("licenseCategory")} />

          <DatePicker label="License Expiration Date" error={errors.licenseExpiry?.message} disabled={loading} {...register("licenseExpiry")} />

          <DatePicker label="Date of Birth" error={errors.dob?.message} disabled={loading} {...register("dob")} />

          <Input label="Street Address" placeholder="e.g. 123 Maple Street" error={errors.address?.message} disabled={loading} {...register("address")} />

          <Input label="City" placeholder="e.g. Los Angeles" error={errors.city?.message} disabled={loading} {...register("city")} />

          <Input label="State" placeholder="e.g. CA" error={errors.state?.message} disabled={loading} {...register("state")} />

          <Input label="Country" placeholder="e.g. USA" error={errors.country?.message} disabled={loading} {...register("country")} />

          <DatePicker label="Joining Date" error={errors.joiningDate?.message} disabled={loading} {...register("joiningDate")} />

          <Input label="Experience (Years)" type="number" placeholder="e.g. 5" error={errors.experience?.message} disabled={loading} {...register("experience")} />

          <Select label="Blood Group" error={errors.bloodGroup?.message} options={bloodGroups} disabled={loading} {...register("bloodGroup")} />

          <Select label="Driver Status" error={errors.status?.message} options={statuses} disabled={loading} {...register("status")} />
        </div>

        <Textarea
          label="Medical or Operational Notes"
          placeholder="Add details on safety records, medical constraints, route preferences, etc..."
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
          {isEdit ? "Save Profile" : "Register Driver"}
        </Button>
      </div>
    </form>
  );
};

export default DriverForm;
