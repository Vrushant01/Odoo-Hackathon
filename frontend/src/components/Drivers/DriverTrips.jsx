import React from "react";
import Table from "../Table/Table";
import StatusBadge from "../StatusBadge/StatusBadge";

export const DriverTrips = ({ trips = [] }) => {
  const columns = [
    {
      accessorKey: "id",
      header: "Trip ID",
      cell: ({ row }) => (
        <span style={{ fontWeight: 700, color: "var(--primary)" }}>
          {row.getValue("id")}
        </span>
      )
    },
    { accessorKey: "vehicle", header: "Vehicle Assigned" },
    { accessorKey: "source", header: "Origin" },
    { accessorKey: "destination", header: "Destination" },
    { accessorKey: "distance", header: "Distance" },
    { accessorKey: "cargo", header: "Cargo" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />
    },
    { accessorKey: "completionDate", header: "Completed Date" }
  ];

  return (
    <Table
      columns={columns}
      data={trips}
      showSearch={false}
      emptyTitle="No dispatches found"
      emptyDescription="This driver has no recorded trip dispatches on active routes."
    />
  );
};

export default DriverTrips;
