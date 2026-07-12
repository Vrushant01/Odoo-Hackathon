import React from "react";
import { X } from "lucide-react";
import { Select, Input, DatePicker, Button } from "../index";
import { useGlobalFilters } from "../../contexts/FilterContext";

export const DashboardFilters = ({ filters: propFilters, updateFilter: propUpdate, resetFilters: propReset }) => {
  // Prefer context; fall back to props for backwards compatibility
  const ctx = useGlobalFilters();
  const filters = propFilters ?? ctx.displayFilters;
  const updateFilter = propUpdate ?? ctx.updateGlobalFilter;
  const resetFilters = propReset ?? ctx.resetGlobalFilters;
  const hasActiveFilters = propFilters
    ? Object.values(propFilters).some((v) => v !== "")
    : ctx.hasActiveGlobalFilters;

  const vehicleTypes = [
    { value: "", label: "All Types" },
    { value: "Heavy Truck", label: "Heavy Truck" },
    { value: "Delivery Van", label: "Delivery Van" },
    { value: "Cargo Van", label: "Cargo Van" },
    { value: "Flatbed Trailer", label: "Flatbed Trailer" }
  ];

  // Values match backend vehicle status enum
  const vehicleStatuses = [
    { value: "", label: "All Statuses" },
    { value: "Available", label: "Available" },
    { value: "On Trip", label: "On Trip" },
    { value: "In Shop", label: "In Shop" },
    { value: "Retired", label: "Retired" }
  ];

  const regions = [
    { value: "", label: "All Regions" },
    { value: "East", label: "East Region" },
    { value: "West", label: "West Region" },
    { value: "South", label: "South Region" },
    { value: "North", label: "North Region" }
  ];

  // Values match backend trip status enum
  const tripStatuses = [
    { value: "", label: "All Trip Statuses" },
    { value: "Draft", label: "Draft" },
    { value: "Dispatched", label: "Dispatched" },
    { value: "Completed", label: "Completed" },
    { value: "Cancelled", label: "Cancelled" }
  ];

  return (
    <div
      className="glass-panel dashboard-filters-grid"
      style={{
        padding: "1.5rem 1.75rem",
        borderRadius: "var(--radius-lg)",
        marginBottom: "2.25rem"
      }}
    >
      <Select
        label="Vehicle Type"
        value={filters.vehicleType}
        onChange={(e) => updateFilter("vehicleType", e.target.value)}
        options={vehicleTypes}
      />

      <Select
        label="Vehicle Status"
        value={filters.vehicleStatus}
        onChange={(e) => updateFilter("vehicleStatus", e.target.value)}
        options={vehicleStatuses}
      />

      <Select
        label="Region"
        value={filters.region}
        onChange={(e) => updateFilter("region", e.target.value)}
        options={regions}
      />

      <Input
        label="Driver Search"
        placeholder="Driver name..."
        value={filters.driver}
        onChange={(e) => updateFilter("driver", e.target.value)}
      />

      <Select
        label="Trip Status"
        value={filters.tripStatus}
        onChange={(e) => updateFilter("tripStatus", e.target.value)}
        options={tripStatuses}
      />

      <DatePicker
        label="Start Date"
        value={filters.startDate}
        onChange={(e) => updateFilter("startDate", e.target.value)}
      />

      <DatePicker
        label="End Date"
        value={filters.endDate}
        onChange={(e) => updateFilter("endDate", e.target.value)}
      />

      {/* Always rendered — hidden via CSS when no filters active so layout never shifts */}
      <div
        className={`filter-clear-btn${hasActiveFilters ? "" : " hidden"}`}
        style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}
      >
        <span style={{ fontSize: "0.875rem", fontWeight: 600, visibility: "hidden" }}>&nbsp;</span>
        <Button
          variant="secondary"
          onClick={resetFilters}
          startIcon={<X size={16} />}
          style={{ width: "100%", justifyContent: "center", padding: "0.625rem 1rem" }}
          tabIndex={hasActiveFilters ? 0 : -1}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default DashboardFilters;

