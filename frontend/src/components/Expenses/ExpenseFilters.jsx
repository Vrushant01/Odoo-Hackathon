import React, { useState } from "react";
import { Filter, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { Select, Input, Button } from "../index";

export const ExpenseFilters = ({ filters, updateFilter, resetFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  const expenseTypes = [
    { value: "", label: "All Expense Types" },
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

  const paymentStatuses = [
    { value: "", label: "All Statuses" },
    { value: "Paid", label: "Paid" },
    { value: "Pending", label: "Pending" },
    { value: "Cancelled", label: "Cancelled" }
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
            label="Expense Category Type"
            value={filters.type}
            onChange={(e) => updateFilter("type", e.target.value)}
            options={expenseTypes}
            style={{ marginBottom: 0 }}
          />

          <Select
            label="Invoice Status"
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            options={paymentStatuses}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Specific Vehicle"
            placeholder="Search vehicle model or plate..."
            value={filters.vehicle}
            onChange={(e) => updateFilter("vehicle", e.target.value)}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Associated Trip ID"
            placeholder="Search trip e.g. TR-..."
            value={filters.tripId}
            onChange={(e) => updateFilter("tripId", e.target.value)}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Billing Vendor"
            placeholder="e.g. Shell Inc, Tolls..."
            value={filters.vendor}
            onChange={(e) => updateFilter("vendor", e.target.value)}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Region / Remarks"
            placeholder="e.g. CA, FL, ticket..."
            value={filters.region}
            onChange={(e) => updateFilter("region", e.target.value)}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Billing Start Date"
            type="date"
            value={filters.startDate}
            onChange={(e) => updateFilter("startDate", e.target.value)}
            style={{ marginBottom: 0 }}
          />

          <Input
            label="Billing End Date"
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

export default ExpenseFilters;
