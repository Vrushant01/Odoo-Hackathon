import React from "react";
import { Plus, RefreshCw, Download } from "lucide-react";
import PageHeader from "../PageHeader/PageHeader";
import Button from "../Button/Button";

export const DriverHeader = ({ totalCount, onRegisterClick, onRefresh, onExportClick }) => {
  const breadcrumbs = [
    { label: "Home", route: "/dashboard" },
    { label: "Drivers", route: "/drivers" }
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
        onClick={onRegisterClick}
        startIcon={<Plus size={16} />}
      >
        Register Driver
      </Button>
    </div>
  );

  return (
    <PageHeader
      title="Driver Management"
      subtitle={`Oversee all ${totalCount} logistics operators`}
      breadcrumbItems={breadcrumbs}
      action={actions}
    />
  );
};

export default DriverHeader;
