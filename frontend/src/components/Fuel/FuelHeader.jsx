import React from "react";
import { Plus, RefreshCw, Download } from "lucide-react";
import PageHeader from "../PageHeader/PageHeader";
import Button from "../Button/Button";

export const FuelHeader = ({ totalCount, onCreateClick, onRefresh, onExportClick }) => {
  const breadcrumbs = [
    { label: "Home", route: "/dashboard" },
    { label: "Fuel Management", route: "/fuel" }
  ];

  const actions = (
    <div style={{ display: "flex", gap: "0.75rem" }}>
      <Button
        variant="outline"
        onClick={onExportClick}
        startIcon={<Download size={16} />}
      >
        Export Logs
      </Button>
      <Button
        variant="outline"
        onClick={onRefresh}
        startIcon={<RefreshCw size={16} />}
      >
        Refresh
      </Button>
      <Button
        variant="primary"
        onClick={onCreateClick}
        startIcon={<Plus size={16} />}
      >
        Log Fuel Refuel
      </Button>
    </div>
  );

  return (
    <PageHeader
      title="Fuel Operations"
      subtitle={`Track and manage all ${totalCount} refueling invoices`}
      breadcrumbItems={breadcrumbs}
      action={actions}
    />
  );
};

export default FuelHeader;
