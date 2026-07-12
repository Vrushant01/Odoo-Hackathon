import React, { useState } from "react";
import { Filter, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { Select, Input, Button } from "../index";

export const TripFilters = ({ filters, updateFilter, resetFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  const tripStatuses = [
    { value: "", label: "All Statuses" },
    { value: "Draft", label: "Draft" },
    { value: "Dispatched", label: "Dispatched (Active)" },
    { value: "Completed", label: "Completed" },
    { value: "Cancelled", label: "Cancelled" }
  ];

  const types = [
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
            size="sm"
            onClick={resetFilters}
            startIcon={<RotateCcw size={12} />}
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
            label="Trip Status"
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            options={tripStatuses}
            style={{ marginBottom: 0 }}
          />

          <Select
            label="Target Vehicle Type"
            value={filters.vehicleType}
            onChange={(e) => updateFilter("vehicleType", e.target.value)}
            options={types}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Assignee Driver"
            placeholder="Search driver name..."
            value={filters.driver}
            onChange={(e) => updateFilter("driver", e.target.value)}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Assignee Vehicle Plate"
            placeholder="Search plate number..."
            value={filters.vehicle}
            onChange={(e) => updateFilter("vehicle", e.target.value)}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Region / Notes"
            placeholder="e.g. TX, Dallas..."
            value={filters.region}
            onChange={(e) => updateFilter("region", e.target.value)}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Created Start Date"
            type="date"
            value={filters.startDate}
            onChange={(e) => updateFilter("startDate", e.target.value)}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Created End Date"
            type="date"
            value={filters.endDate}
            onChange={(e) => updateFilter("endDate", e.target.value)}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Min Distance (miles)"
            type="number"
            value={filters.minDistance}
            onChange={(e) => updateFilter("minDistance", e.target.value)}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Max Distance (miles)"
            type="number"
            value={filters.maxDistance}
            onChange={(e) => updateFilter("maxDistance", e.target.value)}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Min Payload Weight (lbs)"
            type="number"
            value={filters.minCargoWeight}
            onChange={(e) => updateFilter("minCargoWeight", e.target.value)}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Max Payload Weight (lbs)"
            type="number"
            value={filters.maxCargoWeight}
            onChange={(e) => updateFilter("maxCargoWeight", e.target.value)}
            style={{ marginBottom: 0 }}
          />
        </div>
      )}
    </div>
  );
};

export default TripFilters;
