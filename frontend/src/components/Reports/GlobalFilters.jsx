import React, { useState } from "react";
import { Filter, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { Select, Input, Button } from "../index";

export const GlobalFilters = ({ filters, updateFilter, resetFilters, hasActiveFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  const vehicleTypes = [
    { value: "", label: "All Vehicle Types" },
    { value: "Heavy Truck", label: "Heavy Truck" },
    { value: "Delivery Van", label: "Delivery Van" },
    { value: "Tanker", label: "Tanker" },
    { value: "Flatbed", label: "Flatbed" },
    { value: "Refrigerated", label: "Refrigerated" }
  ];

  const tripStatuses = [
    { value: "", label: "All Trip Statuses" },
    { value: "Completed", label: "Completed" },
    { value: "In Progress", label: "In Progress" },
    { value: "Scheduled", label: "Scheduled" },
    { value: "Cancelled", label: "Cancelled" }
  ];

  const maintenanceStatuses = [
    { value: "", label: "All Maintenance Statuses" },
    { value: "Completed", label: "Completed" },
    { value: "In Progress", label: "In Progress" },
    { value: "Scheduled", label: "Scheduled" },
    { value: "Cancelled", label: "Cancelled" }
  ];

  const fuelTypes = [
    { value: "", label: "All Fuel Types" },
    { value: "Diesel", label: "Diesel" },
    { value: "Petrol", label: "Petrol" },
    { value: "CNG", label: "CNG" },
    { value: "Electric", label: "Electric" }
  ];

  const expenseTypes = [
    { value: "", label: "All Expense Types" },
    { value: "Fuel", label: "Fuel" },
    { value: "Maintenance", label: "Maintenance" },
    { value: "Toll", label: "Toll" },
    { value: "Insurance", label: "Insurance" },
    { value: "Parking", label: "Parking" },
    { value: "Fine", label: "Fine" },
    { value: "Other", label: "Other" }
  ];

  return (
    <div style={{ marginBottom: "1.5rem", width: "100%" }}>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          startIcon={<Filter size={16} />}
          endIcon={isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        >
          Global Filters {hasActiveFilters && "(Active)"}
        </Button>
        {hasActiveFilters && (
          <Button
            variant="secondary"
            size="sm"
            onClick={resetFilters}
            startIcon={<RotateCcw size={12} />}
          >
            Reset All
          </Button>
        )}
      </div>

      {isOpen && (
        <div
          className="glass-panel fade-in"
          style={{
            marginTop: "1rem",
            padding: "1.5rem",
            borderRadius: "var(--radius-md)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.25rem",
            border: "1px solid var(--border-color)"
          }}
        >
          <Input
            label="Start Date"
            type="date"
            value={filters.dateRange.start}
            onChange={(e) => updateFilter("dateRange", { ...filters.dateRange, start: e.target.value })}
            style={{ marginBottom: 0 }}
          />
          <Input
            label="End Date"
            type="date"
            value={filters.dateRange.end}
            onChange={(e) => updateFilter("dateRange", { ...filters.dateRange, end: e.target.value })}
            style={{ marginBottom: 0 }}
          />
          <Input
            label="Vehicle"
            placeholder="Search vehicle..."
            value={filters.vehicle}
            onChange={(e) => updateFilter("vehicle", e.target.value)}
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
            label="Driver"
            placeholder="Search driver..."
            value={filters.driver}
            onChange={(e) => updateFilter("driver", e.target.value)}
            style={{ marginBottom: 0 }}
          />
          <Select
            label="Trip Status"
            value={filters.tripStatus}
            onChange={(e) => updateFilter("tripStatus", e.target.value)}
            options={tripStatuses}
            style={{ marginBottom: 0 }}
          />
          <Select
            label="Maintenance Status"
            value={filters.maintenanceStatus}
            onChange={(e) => updateFilter("maintenanceStatus", e.target.value)}
            options={maintenanceStatuses}
            style={{ marginBottom: 0 }}
          />
          <Input
            label="Region"
            placeholder="e.g. East Bay, Central..."
            value={filters.region}
            onChange={(e) => updateFilter("region", e.target.value)}
            style={{ marginBottom: 0 }}
          />
          <Select
            label="Fuel Type"
            value={filters.fuelType}
            onChange={(e) => updateFilter("fuelType", e.target.value)}
            options={fuelTypes}
            style={{ marginBottom: 0 }}
          />
          <Select
            label="Expense Type"
            value={filters.expenseType}
            onChange={(e) => updateFilter("expenseType", e.target.value)}
            options={expenseTypes}
            style={{ marginBottom: 0 }}
          />
        </div>
      )}
    </div>
  );
};

export default GlobalFilters;
