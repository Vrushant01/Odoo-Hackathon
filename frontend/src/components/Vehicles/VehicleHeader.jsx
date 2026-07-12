import React from "react";
import { Plus, RefreshCw, Download } from "lucide-react";
import PageHeader from "../PageHeader/PageHeader";
import Button from "../Button/Button";

export const VehicleHeader = ({ totalCount, onAddClick, onRefresh, onExportClick }) => {
  const breadcrumbs = [
    { label: "Home", route: "/dashboard" },
    { label: "Registry", route: "/vehicles" }
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
        onClick={onAddClick}
        startIcon={<Plus size={16} />}
      >
        Add Vehicle
      </Button>
    </div>
  );

  return (
    <PageHeader
      title="Vehicle Registry"
      subtitle={`Oversee all ${totalCount} active transport assets`}
      breadcrumbItems={breadcrumbs}
      action={actions}
    />
  );
};

export default VehicleHeader;
