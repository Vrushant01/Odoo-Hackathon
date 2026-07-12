import React, { useState } from "react";
import { Filter, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { Select, Input, Button } from "../index";

export const FuelFilters = ({ filters, updateFilter, resetFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  const fuelTypes = [
    { value: "", label: "All Fuel Types" },
    { value: "Diesel", label: "Diesel" },
    { value: "Petrol", label: "Petrol" },
    { value: "CNG", label: "CNG" },
    { value: "Electric", label: "Electric" },
    { value: "Hybrid", label: "Hybrid" },
    { value: "Other", label: "Other" }
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
            label="Fuel Type"
            value={filters.fuelType}
            onChange={(e) => updateFilter("fuelType", e.target.value)}
            options={fuelTypes}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Target Vehicle Unit"
            placeholder="Search vehicle model or plate..."
            value={filters.vehicle}
            onChange={(e) => updateFilter("vehicle", e.target.value)}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Operator Driver"
            placeholder="Search driver name..."
            value={filters.driver}
            onChange={(e) => updateFilter("driver", e.target.value)}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Trip ID"
            placeholder="Search trip code e.g. TR-..."
            value={filters.tripId}
            onChange={(e) => updateFilter("tripId", e.target.value)}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Refuel Station"
            placeholder="e.g. Shell Station #4..."
            value={filters.fuelStation}
            onChange={(e) => updateFilter("fuelStation", e.target.value)}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Region / Remarks"
            placeholder="e.g. FL, Miami, gate..."
            value={filters.region}
            onChange={(e) => updateFilter("region", e.target.value)}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Refuel Start Date"
            type="date"
            value={filters.startDate}
            onChange={(e) => updateFilter("startDate", e.target.value)}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Refuel End Date"
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

export default FuelFilters;
