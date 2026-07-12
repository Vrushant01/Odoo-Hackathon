import React, { useState } from "react";
import { FileText, Download, Loader2 } from "lucide-react";
import Button from "../Button/Button";
import Card from "../Card/Card";

const REPORT_TYPES = [
  { id: "fleet", label: "Fleet Report", description: "Vehicle utilization, status, and performance" },
  { id: "driver", label: "Driver Report", description: "Driver performance, safety scores, and rankings" },
  { id: "trip", label: "Trip Report", description: "Trip volumes, completion rates, and distances" },
  { id: "maintenance", label: "Maintenance Report", description: "Maintenance costs, frequency, and downtime" },
  { id: "fuel", label: "Fuel Report", description: "Fuel consumption, costs, and efficiency" },
  { id: "expense", label: "Expense Report", description: "Expense breakdown by category and vehicle" },
  { id: "operational", label: "Operational Report", description: "Full operational overview across all modules" },
  { id: "profitability", label: "Profitability Report", description: "Revenue, costs, profit, and ROI analysis" }
];

const FORMATS = [
  { value: "PDF", label: "PDF Document" },
  { value: "CSV", label: "CSV Spreadsheet" },
  { value: "Excel", label: "Excel Workbook" }
];

export const ReportGenerator = ({ onGenerate, isGenerating, onClose }) => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [format, setFormat] = useState("PDF");

  const toggleType = (id) => {
    setSelectedTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (selectedTypes.length === 0) return;

    for (const type of selectedTypes) {
      const reportType = REPORT_TYPES.find((rt) => rt.id === type);
      await onGenerate({
        type: reportType.label,
        title: `${reportType.label} — ${new Date().toLocaleDateString()}`,
        format,
        generatedBy: "System User"
      });
    }

    setSelectedTypes([]);
    if (onClose) onClose();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
        Select one or more report types to generate. Reports will be added to your Report History.
      </p>

      {/* Report Types */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.75rem" }}>
        {REPORT_TYPES.map((rt) => {
          const isSelected = selectedTypes.includes(rt.id);
          return (
            <div
              key={rt.id}
              onClick={() => toggleType(rt.id)}
              style={{
                padding: "0.875rem",
                borderRadius: "var(--radius-sm)",
                border: `2px solid ${isSelected ? "var(--primary)" : "var(--border-color)"}`,
                backgroundColor: isSelected ? "color-mix(in srgb, var(--primary) 8%, transparent)" : "var(--bg-secondary)",
                cursor: "pointer",
                transition: "all var(--transition-fast)",
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-start"
              }}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {}}
                style={{ accentColor: "var(--primary)", marginTop: "0.125rem", cursor: "pointer" }}
              />
              <div>
                <strong style={{ fontSize: "0.85rem", display: "block" }}>{rt.label}</strong>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{rt.description}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Format Selector */}
      <div>
        <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "0.375rem" }}>
          Output Format
        </label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {FORMATS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFormat(f.value)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-sm)",
                border: `2px solid ${format === f.value ? "var(--primary)" : "var(--border-color)"}`,
                backgroundColor: format === f.value ? "var(--primary)" : "var(--bg-secondary)",
                color: format === f.value ? "var(--text-inverse)" : "var(--text-secondary)",
                fontWeight: 700,
                fontSize: "0.8rem",
                cursor: "pointer",
                transition: "all var(--transition-fast)"
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button
          variant="primary"
          onClick={handleGenerate}
          disabled={selectedTypes.length === 0 || isGenerating}
          startIcon={isGenerating ? <Loader2 size={16} className="spin" /> : <FileText size={16} />}
        >
          {isGenerating ? "Generating..." : `Generate ${selectedTypes.length || ""} Report${selectedTypes.length !== 1 ? "s" : ""}`}
        </Button>
      </div>
    </div>
  );
};

export default ReportGenerator;
