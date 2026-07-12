import React from "react";
import Table from "../Table/Table";
import StatusBadge from "../StatusBadge/StatusBadge";

export const MaintenanceHistory = ({ history = [] }) => {
  const formatCost = (val) => `$${Number(val).toFixed(2)}`;

  const columns = [
    { accessorKey: "date", header: "Serviced Date" },
    { accessorKey: "type", header: "Service Type" },
    { accessorKey: "workshop", header: "Workshop Center" },
    { accessorKey: "cost", header: "Total Cost", cell: ({ row }) => formatCost(row.getValue("cost")) },
    { accessorKey: "duration", header: "Duration Hours" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />
    }
  ];

  return (
    <Table
      columns={columns}
      data={history}
      showSearch={false}
      emptyTitle="No previous maintenance logs"
      emptyDescription="This vehicle has no recorded completed maintenance history."
    />
  );
};

export default MaintenanceHistory;
