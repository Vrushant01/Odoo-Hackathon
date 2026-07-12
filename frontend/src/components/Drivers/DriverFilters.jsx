import React, { useState } from "react";
import { Filter, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { Select, Input, Button } from "../index";

export const DriverFilters = ({ filters, updateFilter, resetFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  const driverStatuses = [
    { value: "", label: "All Statuses" },
    { value: "Available", label: "Available" },
    { value: "On Trip", label: "On Trip" },
    { value: "Off Duty", label: "Off Duty" },
    { value: "Suspended", label: "Suspended" },
    { value: "License Expired", label: "License Expired" }
  ];

  const licenseCategories = [
    { value: "", label: "All Categories" },
    { value: "Class A CDL", label: "Class A CDL" },
    { value: "Class B CDL", label: "Class B CDL" }
  ];

  const licenseExpirations = [
    { value: "", label: "Any Expiry Status" },
    { value: "expired", label: "Expired License" },
    { value: "soon", label: "Expiring Soon (<30d)" },
    { value: "valid", label: "Fully Valid" }
  ];

  const safetyRanges = [
    { value: "", label: "Any Safety Rating" },
    { value: "low", label: "Low (<80%)" },
    { value: "medium", label: "Medium (80-89%)" },
    { value: "high", label: "High (>=90%)" }
  ];

  const vehicleAssignments = [
    { value: "", label: "Any Assignment" },
    { value: "assigned", label: "Assigned to Vehicle" },
    { value: "unassigned", label: "No Assigned Vehicle" }
  ];

  const availabilityOptions = [
    { value: "", label: "Any Availability" },
    { value: "available", label: "Available (Ready)" },
    { value: "busy", label: "On Active Trip" },
    { value: "suspended", label: "Suspended / Off-Duty" }
  ];

  const hasActiveFilters = Object.values(filters).some(val => val !== "");

  return (
    <div style={{ marginBottom: "1.5rem", width: "100%" }}>
      {/* Trigger Row */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          startIcon={<Filter size={16} />}
          endIcon={isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        >
          Advanced Filters {hasActiveFilters && "(Active)"}
        </Button>
        {hasActiveFilters && (
          <Button
            variant="secondary"
            onClick={resetFilters}
            startIcon={<RotateCcw size={16} />}
          >
            Reset Filters
          </Button>
        )}
      </div>

      {/* Grid panel */}
      {isOpen && (
        <div
          className="glass-panel"
          style={{
            marginTop: "1rem",
            padding: "1.5rem",
            borderRadius: "var(--radius-md)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.25rem",
            border: "1px solid var(--border-color)",
            animation: "fadeIn 0.2s forwards"
          }}
        >
          <Select
            label="Driver Status"
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            options={driverStatuses}
            style={{ marginBottom: 0 }}
          />

          <Select
            label="License Category"
            value={filters.licenseCategory}
            onChange={(e) => updateFilter("licenseCategory", e.target.value)}
            options={licenseCategories}
            style={{ marginBottom: 0 }}
          />

          <Select
            label="License Expiry"
            value={filters.licenseExpiry}
            onChange={(e) => updateFilter("licenseExpiry", e.target.value)}
            options={licenseExpirations}
            style={{ marginBottom: 0 }}
          />

          <Select
            label="Safety Score"
            value={filters.safetyScore}
            onChange={(e) => updateFilter("safetyScore", e.target.value)}
            options={safetyRanges}
            style={{ marginBottom: 0 }}
          />

          <Select
            label="Vehicle Assignment"
            value={filters.assignedVehicle}
            onChange={(e) => updateFilter("assignedVehicle", e.target.value)}
            options={vehicleAssignments}
            style={{ marginBottom: 0 }}
          />

          <Select
            label="Work Availability"
            value={filters.availability}
            onChange={(e) => updateFilter("availability", e.target.value)}
            options={availabilityOptions}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Search Region Hub"
            placeholder="e.g. TX, California"
            value={filters.region}
            onChange={(e) => updateFilter("region", e.target.value)}
            style={{ marginBottom: 0 }}
          />
        </div>
      )}
    </div>
  );
};

export default DriverFilters;
