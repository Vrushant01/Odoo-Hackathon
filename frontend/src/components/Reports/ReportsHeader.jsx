import React from "react";
import { FileText, Download, RefreshCw, Clock } from "lucide-react";
import PageHeader from "../PageHeader/PageHeader";
import Button from "../Button/Button";

export const ReportsHeader = ({ lastUpdated, onGenerate, onExport, onRefresh }) => {
  const breadcrumbs = [
    { label: "Home", route: "/dashboard" },
    { label: "Reports & Analytics", route: "/reports" }
  ];

  const formatTime = (date) => {
    if (!date) return "Loading...";
    return date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
  };

  const actions = (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.375rem",
        fontSize: "0.8rem",
        color: "var(--text-muted)",
        fontWeight: 600
      }}>
        <Clock size={13} />
        Updated: {formatTime(lastUpdated)}
      </div>
      <Button
        variant="outline"
        onClick={onRefresh}
        startIcon={<RefreshCw size={16} />}
      >
        Refresh
      </Button>
      <Button
        variant="outline"
        onClick={onExport}
        startIcon={<Download size={16} />}
      >
        Export Report
      </Button>
      <Button
        variant="primary"
        onClick={onGenerate}
        startIcon={<FileText size={16} />}
      >
        Generate Report
      </Button>
    </div>
  );

  return (
    <PageHeader
      title="Reports & Analytics"
      subtitle="Generate reports, export logs, and analyze fleet efficiency"
      breadcrumbItems={breadcrumbs}
      action={actions}
    />
  );
};

export default ReportsHeader;
