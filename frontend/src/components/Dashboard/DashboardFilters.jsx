import React from "react";
import { X } from "lucide-react";
import { Select, Input, DatePicker, Button } from "../index";

export const DashboardFilters = ({ filters, updateFilter, resetFilters }) => {
  const vehicleTypes = [
    { value: "", label: "All Types" },
    { value: "Heavy Truck", label: "Heavy Truck" },
    { value: "Delivery Van", label: "Delivery Van" },
    { value: "Cargo Van", label: "Cargo Van" },
    { value: "Flatbed Trailer", label: "Flatbed Trailer" }
  ];

  const vehicleStatuses = [
    { value: "", label: "All Statuses" },
    { value: "Active", label: "Active" },
    { value: "Maintenance", label: "Maintenance" },
    { value: "Inactive", label: "Inactive" }
  ];

  const regions = [
    { value: "", label: "All Regions" },
    { value: "East", label: "East Region" },
    { value: "West", label: "West Region" },
    { value: "South", label: "South Region" },
    { value: "North", label: "North Region" }
  ];

  const tripStatuses = [
    { value: "", label: "All Trip Statuses" },
    { value: "Scheduled", label: "Scheduled" },
    { value: "Active", label: "Active" },
    { value: "Completed", label: "Completed" },
    { value: "Cancelled", label: "Cancelled" }
  ];

  const hasActiveFilters = Object.values(filters).some(val => val !== "");

  return (
    <div className="glass-panel" style={{
      padding: "1.25rem 1.5rem",
      borderRadius: "var(--radius-lg)",
      marginBottom: "2rem",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "1rem",
      alignItems: "end"
    }}>
      <Select
        label="Vehicle Type"
        value={filters.vehicleType}
        onChange={(e) => updateFilter("vehicleType", e.target.value)}
        options={vehicleTypes}
        style={{ marginBottom: 0 }}
      />

      <Select
        label="Vehicle Status"
        value={filters.vehicleStatus}
        onChange={(e) => updateFilter("vehicleStatus", e.target.value)}
        options={vehicleStatuses}
        style={{ marginBottom: 0 }}
      />

      <Select
        label="Region"
        value={filters.region}
        onChange={(e) => updateFilter("region", e.target.value)}
        options={regions}
        style={{ marginBottom: 0 }}
      />

      <Input
        label="Driver Search"
        placeholder="Driver name..."
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

      <DatePicker
        label="Start Date"
        value={filters.startDate}
        onChange={(e) => updateFilter("startDate", e.target.value)}
        style={{ marginBottom: 0 }}
      />

      <DatePicker
        label="End Date"
        value={filters.endDate}
        onChange={(e) => updateFilter("endDate", e.target.value)}
        style={{ marginBottom: 0 }}
      />

      {hasActiveFilters && (
        <Button
          variant="secondary"
          onClick={resetFilters}
          startIcon={<X size={16} />}
          style={{ width: "100%", justifyContent: "center" }}
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default DashboardFilters;
