import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, ExternalLink } from "lucide-react";
import Table from "../Table/Table";
import StatusBadge from "../StatusBadge/StatusBadge";
import Button from "../Button/Button";

export const RecentTripsTable = ({ trips, isLoading }) => {
  const navigate = useNavigate();

  const handleViewDetails = (id) => {
    navigate(`/trips?id=${id}`);
  };

  // Define columns matching the required headers
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
    {
      accessorKey: "vehicle",
      header: "Vehicle",
      cell: ({ row }) => <span>{row.getValue("vehicle")}</span>
    },
    {
      accessorKey: "driver",
      header: "Driver",
      cell: ({ row }) => <span>{row.getValue("driver")}</span>
    },
    {
      accessorKey: "source",
      header: "Origin"
    },
    {
      accessorKey: "destination",
      header: "Destination"
    },
    {
      accessorKey: "cargoWeight",
      header: "Cargo Weight"
    },
    {
      accessorKey: "distance",
      header: "Distance"
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />
    },
    {
      accessorKey: "startDate",
      header: "Start Date"
    },
    {
      accessorKey: "expectedCompletion",
      header: "Expected Completion"
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleViewDetails(row.original.id)}
          startIcon={<Eye size={12} />}
        >
          View
        </Button>
      )
    }
  ];

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h3 style={{
        fontFamily: "var(--font-accent)",
        fontWeight: 700,
        fontSize: "1.25rem",
        marginBottom: "1rem",
        color: "var(--text-primary)"
      }}>
        Recent Operation Logs
      </h3>
      <Table
        columns={columns}
        data={trips}
        isLoading={isLoading}
        searchPlaceholder="Search trips (ID, Driver, Vehicle, Route)..."
        emptyTitle="No operational logs found"
        emptyDescription="There are no recent trips recorded matching the current filter parameters."
      />
    </div>
  );
};

export default RecentTripsTable;
