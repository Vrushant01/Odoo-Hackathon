import React from "react";
import { Download, FileText, Printer } from "lucide-react";
import Button from "../Button/Button";
import Card from "../Card/Card";

export const ExportPanel = ({ onExport }) => {
  return (
    <Card title="Export Reports" subtitle="Download or print report data">
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem"
      }}>
        <div
          className="glass-panel"
          style={{
            padding: "1.25rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
            textAlign: "center"
          }}
        >
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "var(--radius-sm)",
            backgroundColor: "color-mix(in srgb, var(--success) 12%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Download size={22} style={{ color: "var(--success)" }} />
          </div>
          <strong style={{ fontSize: "0.9rem" }}>Export CSV</strong>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
            Download raw data as comma-separated values for spreadsheet analysis.
          </p>
          <Button variant="outline" size="sm" onClick={() => onExport("csv", "operational")}>
            Download CSV
          </Button>
        </div>

        <div
          className="glass-panel"
          style={{
            padding: "1.25rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
            textAlign: "center"
          }}
        >
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "var(--radius-sm)",
            backgroundColor: "color-mix(in srgb, var(--primary) 12%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <FileText size={22} style={{ color: "var(--primary)" }} />
          </div>
          <strong style={{ fontSize: "0.9rem" }}>Export PDF</strong>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
            Generate a formatted PDF document for reporting and archival.
          </p>
          <Button variant="outline" size="sm" onClick={() => onExport("pdf", "operational")}>
            Download PDF
          </Button>
        </div>

        <div
          className="glass-panel"
          style={{
            padding: "1.25rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-color)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
            textAlign: "center"
          }}
        >
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "var(--radius-sm)",
            backgroundColor: "color-mix(in srgb, var(--warning) 12%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Printer size={22} style={{ color: "var(--warning)" }} />
          </div>
          <strong style={{ fontSize: "0.9rem" }}>Print Report</strong>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
            Send current report view to the printer for physical copies.
          </p>
          <Button variant="outline" size="sm" onClick={() => onExport("print", "operational")}>
            Print Report
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ExportPanel;
