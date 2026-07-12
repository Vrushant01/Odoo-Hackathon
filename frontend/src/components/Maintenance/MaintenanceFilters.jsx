import React, { useState } from "react";
import { Filter, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { Select, Input, Button } from "../index";

export const MaintenanceFilters = ({ filters, updateFilter, resetFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  const statuses = [
    { value: "", label: "All Statuses" },
    { value: "Scheduled", label: "Scheduled" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
    { value: "Cancelled", label: "Cancelled" },
    { value: "Overdue", label: "Overdue" }
  ];

  const types = [
    { value: "", label: "All Service Types" },
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

  const priorities = [
    { value: "", label: "All Priorities" },
    { value: "Low", label: "Low Priority" },
    { value: "Medium", label: "Medium Priority" },
    { value: "High", label: "High Priority" },
    { value: "Critical", label: "Critical Priority" }
  ];

  const vehicleTypes = [
    { value: "", label: "All Vehicle Types" },
    { value: "Heavy Truck", label: "Heavy Truck" },
    { value: "Cargo Van", label: "Cargo Van" },
    { value: "Delivery Van", label: "Delivery Van" },
    { value: "Flatbed Trailer", label: "Flatbed Trailer" }
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
            label="Worksheet Status"
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            options={statuses}
            style={{ marginBottom: 0 }}
          />

          <Select
            label="Service Type"
            value={filters.type}
            onChange={(e) => updateFilter("type", e.target.value)}
            options={types}
            style={{ marginBottom: 0 }}
          />

          <Select
            label="Priority Level"
            value={filters.priority}
            onChange={(e) => updateFilter("priority", e.target.value)}
            options={priorities}
            style={{ marginBottom: 0 }}
          />

          <Select
            label="Vehicle Type"
            value={filters.vehicleType}
            onChange={(e) => updateFilter("vehicleType", e.target.value)}
            options={vehicleTypes}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Specific Vehicle"
            placeholder="Search plate or model..."
            value={filters.vehicle}
            onChange={(e) => updateFilter("vehicle", e.target.value)}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Assigned Mechanic"
            placeholder="Search mechanic name..."
            value={filters.mechanic}
            onChange={(e) => updateFilter("mechanic", e.target.value)}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Workshop Center"
            placeholder="Search workshop name..."
            value={filters.workshop}
            onChange={(e) => updateFilter("workshop", e.target.value)}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Region Hub"
            placeholder="e.g. West, Houston Yard..."
            value={filters.region}
            onChange={(e) => updateFilter("region", e.target.value)}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Scheduled Date Start"
            type="date"
            value={filters.startDate}
            onChange={(e) => updateFilter("startDate", e.target.value)}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Scheduled Date End"
            type="date"
            value={filters.endDate}
            onChange={(e) => updateFilter("endDate", e.target.value)}
            style={{ marginBottom: 0 }}
          />
        </div>
      )}
    </div>
  );
};

export default MaintenanceFilters;
