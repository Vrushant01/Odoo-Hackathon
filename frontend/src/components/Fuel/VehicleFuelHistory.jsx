import React from "react";
import Table from "../Table/Table";

export const VehicleFuelHistory = ({ history = [] }) => {
  const formatCost = (val) => `$${Number(val).toFixed(2)}`;
  const formatQuantity = (val) => `${Number(val).toLocaleString()} L`;

  const columns = [
    { accessorKey: "date", header: "Date" },
    { accessorKey: "quantity", header: "Volume (Liters)", cell: ({ row }) => formatQuantity(row.getValue("quantity")) },
    { accessorKey: "amount", header: "Total Cost", cell: ({ row }) => formatCost(row.getValue("amount")) },
    { accessorKey: "fuelStation", header: "Fuel Station" },
    { accessorKey: "driver", header: "Driver" },
    { accessorKey: "tripId", header: "Trip ID" }
  ];

  return (
    <Table
      columns={columns}
      data={history}
      showSearch={false}
      emptyTitle="No refueling history"
      emptyDescription="This vehicle has no recorded fuel refills logged."
    />
  );
};

export default VehicleFuelHistory;
