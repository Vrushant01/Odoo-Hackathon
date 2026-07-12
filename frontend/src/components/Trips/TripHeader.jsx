import React from "react";
import { Plus, RefreshCw, Download } from "lucide-react";
import PageHeader from "../PageHeader/PageHeader";
import Button from "../Button/Button";

export const TripHeader = ({ totalCount, onCreateClick, onRefresh, onExportClick }) => {
  const breadcrumbs = [
    { label: "Home", route: "/dashboard" },
    { label: "Trips", route: "/trips" }
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
        Create Trip
      </Button>
    </div>
  );

  return (
    <PageHeader
      title="Trip Management"
      subtitle={`Track and manage all ${totalCount} delivery dispatches`}
      breadcrumbItems={breadcrumbs}
      action={actions}
    />
  );
};

export default TripHeader;
