import React, { useState } from "react";
import { Filter, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { Select, Input, Button } from "../index";

export const VehicleFilters = ({ filters, updateFilter, resetFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  const vehicleTypes = [
    { value: "", label: "All Types" },
    { value: "Heavy Truck", label: "Heavy Truck" },
    { value: "Cargo Van", label: "Cargo Van" },
    { value: "Delivery Van", label: "Delivery Van" },
    { value: "Flatbed Trailer", label: "Flatbed Trailer" }
  ];

  const vehicleStatuses = [
    { value: "", label: "All Statuses" },
    { value: "Available", label: "Available" },
    { value: "On Trip", label: "On Trip" },
    { value: "In Shop", label: "In Shop (Maintenance)" },
    { value: "Retired", label: "Retired" }
  ];

  const regions = [
    { value: "", label: "All Regions" },
    { value: "South", label: "South Region" },
    { value: "West", label: "West Region" },
    { value: "East", label: "East Region" },
    { value: "North", label: "North Region" }
  ];

  const maintenanceOptions = [
    { value: "", label: "All Maintenance" },
    { value: "due", label: "Due for Maintenance" },
    { value: "ok", label: "Maintenance Clear" }
  ];

  const hasActiveFilters = Object.values(filters).some(val => val !== "");

  return (
    <div style={{ marginBottom: "1.5rem", width: "100%" }}>
      {/* Header trigger row */}
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
            size="sm"
            onClick={resetFilters}
            startIcon={<RotateCcw size={12} />}
          >
            Reset Filters
          </Button>
        )}
      </div>

      {/* Expanded Grid Panel */}
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
            label="Asset Type"
            value={filters.type}
            onChange={(e) => updateFilter("type", e.target.value)}
            options={vehicleTypes}
            style={{ marginBottom: 0 }}
          />

          <Select
            label="Asset Status"
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            options={vehicleStatuses}
            style={{ marginBottom: 0 }}
          />

          <Select
            label="Region Hub"
            value={filters.region}
            onChange={(e) => updateFilter("region", e.target.value)}
            options={regions}
            style={{ marginBottom: 0 }}
          />

          <Select
            label="Inspection Due"
            value={filters.maintenanceStatus}
            onChange={(e) => updateFilter("maintenanceStatus", e.target.value)}
            options={maintenanceOptions}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Min Load Capacity (lbs)"
            type="number"
            placeholder="e.g. 5000"
            value={filters.minLoadCapacity}
            onChange={(e) => updateFilter("minLoadCapacity", e.target.value)}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Max Load Capacity (lbs)"
            type="number"
            placeholder="e.g. 50000"
            value={filters.maxLoadCapacity}
            onChange={(e) => updateFilter("maxLoadCapacity", e.target.value)}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Acquisition Year"
            type="number"
            placeholder="e.g. 2022"
            value={filters.acquisitionYear}
            onChange={(e) => updateFilter("acquisitionYear", e.target.value)}
            style={{ marginBottom: 0 }}
          />
        </div>
      )}
    </div>
  );
};

export default VehicleFilters;
