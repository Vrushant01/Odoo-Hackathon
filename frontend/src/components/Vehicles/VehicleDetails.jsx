import React, { useState, useEffect } from "react";
import { ArrowLeft, User, Calendar, Truck, FileText, Wrench, Fuel, DollarSign, Activity, Settings } from "lucide-react";
import { toast } from "sonner";
import vehicleService from "../../services/vehicleService";
import StatusBadge from "../StatusBadge/StatusBadge";
import Button from "../Button/Button";
import Card from "../Card/Card";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";
import Table from "../Table/Table";
import VehicleHistory from "./VehicleHistory";
import VehicleTimeline from "./VehicleTimeline";
import VehicleDocuments from "./VehicleDocuments";
import VehicleImageUploader from "./VehicleImageUploader";

export const VehicleDetails = ({ vehicleId, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState(null);
  const [history, setHistory] = useState(null);
  const [trips, setTrips] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [fuelLogs, setFuelLogs] = useState([]);
  
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    const fetchAllDetails = async () => {
      setLoading(true);
      try {
        const [vehData, histData, tripsData, maintData, fuelData] = await Promise.all([
          vehicleService.getVehicle(vehicleId),
          vehicleService.getVehicleHistory(vehicleId),
          vehicleService.getVehicleTrips(vehicleId),
          vehicleService.getVehicleMaintenance(vehicleId),
          vehicleService.getVehicleFuelLogs(vehicleId)
        ]);

        if (!vehData) {
          toast.error("Vehicle profile not found.");
          onBack();
          return;
        }

        setVehicle(vehData);
        setHistory(histData);
        setTrips(tripsData);
        setMaintenance(maintData);
        setFuelLogs(fuelData);
      } catch (err) {
        console.error("Failed to load vehicle details:", err);
        toast.error("Vehicle profile not found.");
        onBack();
      } finally {
        setLoading(false);
      }
    };

    if (vehicleId) {
      fetchAllDetails();
    }
  }, [vehicleId, onBack]);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <LoadingSkeleton variant="title" width="300px" height="36px" />
        <LoadingSkeleton variant="rect" height="60px" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.5rem" }}>
          <LoadingSkeleton variant="card" height="350px" />
          <LoadingSkeleton variant="card" height="350px" />
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h3 style={{ color: "var(--danger)" }}>Asset Error</h3>
        <p style={{ color: "var(--text-secondary)" }}>Failed to retrieve details for this vehicle ID.</p>
        <Button variant="primary" onClick={onBack} style={{ marginTop: "1rem" }}>Back to Registry</Button>
      </div>
    );
  }

  // Formatting utilities
  const formatCost = (val) => `$${Number(val).toLocaleString()}`;
  const formatOdo = (val) => `${Number(val).toLocaleString()} mi`;
  const formatCapacity = (val) => `${Number(val).toLocaleString()} lbs`;

  const tabs = [
    { id: "general", label: "Specs & Info", icon: <Truck size={15} /> },
    { id: "trips", label: "Trips History", icon: <Activity size={15} /> },
    { id: "maintenance", label: "Servicing", icon: <Wrench size={15} /> },
    { id: "fuel", label: "Fuel Logs", icon: <Fuel size={15} /> },
    { id: "history", label: "Financial ROI", icon: <DollarSign size={15} /> },
    { id: "documents", label: "Documents", icon: <FileText size={15} /> },
    { id: "timeline", label: "Timeline Logs", icon: <Activity size={15} /> }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Back button and Header row */}
      <div>
        <button
          type="button"
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-secondary)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.9rem",
            fontWeight: 600,
            marginBottom: "0.75rem",
            padding: 0
          }}
        >
          <ArrowLeft size={16} />
          Back to Registry
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <h2 style={{ fontFamily: "var(--font-accent)", fontSize: "1.75rem", fontWeight: 800 }}>
            {vehicle.name}
          </h2>
          <StatusBadge status={vehicle.status} />
        </div>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
          Registration Number: <strong style={{ color: "var(--text-primary)" }}>{vehicle.plateNumber}</strong> • Region Hub: <strong>{vehicle.region}</strong>
        </p>
      </div>

      {/* Tab Navigation buttons */}
      <div className="glass-panel" style={{
        display: "flex",
        padding: "0.25rem",
        borderRadius: "var(--radius-md)",
        gap: "0.25rem",
        overflowX: "auto",
        width: "100%"
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.625rem 1rem",
              border: "none",
              background: activeTab === tab.id ? "var(--primary)" : "transparent",
              color: activeTab === tab.id ? "var(--text-inverse)" : "var(--text-secondary)",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.85rem",
              transition: "all var(--transition-fast)",
              whiteSpace: "nowrap"
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="fade-in">
        {activeTab === "general" && (
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", alignItems: "start" }}>
            {/* Tech specifications card */}
            <Card title="Technical Specifications" subtitle="General asset metrics">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>MANUFACTURER</span>
                  <strong style={{ fontSize: "0.95rem" }}>{vehicle.manufacturer}</strong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>MODEL</span>
                  <strong style={{ fontSize: "0.95rem" }}>{vehicle.model}</strong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>MANUFACTURING YEAR</span>
                  <strong style={{ fontSize: "0.95rem" }}>{vehicle.year}</strong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>FUEL TYPE</span>
                  <strong style={{ fontSize: "0.95rem" }}>{vehicle.fuelType}</strong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>CABIN CAPACITY</span>
                  <strong style={{ fontSize: "0.95rem" }}>{vehicle.capacity}</strong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>MAX LOAD CAPACITY</span>
                  <strong style={{ fontSize: "0.95rem" }}>{formatCapacity(vehicle.loadCapacity)}</strong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>CURRENT ODOMETER</span>
                  <strong style={{ fontSize: "0.95rem" }}>{formatOdo(vehicle.odometer)}</strong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>ACQUISITION COST</span>
                  <strong style={{ fontSize: "0.95rem" }}>{formatCost(vehicle.cost)}</strong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>ACQUISITION DATE</span>
                  <strong style={{ fontSize: "0.95rem" }}>{vehicle.purchaseDate}</strong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>RC BOOK NUMBER</span>
                  <strong style={{ fontSize: "0.95rem", fontFamily: "monospace" }}>{vehicle.rcNumber}</strong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>INSURANCE POLICY</span>
                  <strong style={{ fontSize: "0.95rem", fontFamily: "monospace" }}>{vehicle.insuranceNumber}</strong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>INSURANCE EXPIRY</span>
                  <strong style={{ fontSize: "0.95rem" }}>{vehicle.insuranceExpiry}</strong>
                </div>
              </div>

              {vehicle.notes && (
                <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--border-color)" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "0.25rem" }}>
                    OPERATIONAL REMARKS
                  </span>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>{vehicle.notes}</p>
                </div>
              )}
            </Card>

            {/* Profile Image card */}
            <Card title="Asset Thumbnail" subtitle="Profile image for dispatchers">
              <VehicleImageUploader value={vehicle.documents?.image} />
            </Card>
          </div>
        )}

        {activeTab === "trips" && (
          <Card title="Dispatches History" subtitle="Trips completed by this vehicle">
            <Table
              columns={[
                { accessorKey: "id", header: "Trip ID", cell: ({ row }) => <span style={{ fontWeight: 700, color: "var(--primary)" }}>{row.getValue("id")}</span> },
                { accessorKey: "driver", header: "Driver" },
                { accessorKey: "origin", header: "Origin" },
                { accessorKey: "destination", header: "Destination" },
                { accessorKey: "distance", header: "Distance" },
                { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge status={row.getValue("status")} /> },
                { accessorKey: "startDate", header: "Start Date" }
              ]}
              data={trips}
              showSearch={false}
              emptyTitle="No dispatches logged"
              emptyDescription="This vehicle has not been scheduled or dispatched on any trips yet."
            />
          </Card>
        )}

        {activeTab === "maintenance" && (
          <Card title="Servicing Ledger" subtitle="Maintenance records and repairs history">
            <Table
              columns={[
                { accessorKey: "id", header: "W.O. Code", cell: ({ row }) => <span style={{ fontWeight: 700 }}>{row.getValue("id")}</span> },
                { accessorKey: "type", header: "Type" },
                { accessorKey: "description", header: "Description" },
                { accessorKey: "cost", header: "Service Cost", cell: ({ row }) => formatCost(row.getValue("cost")) },
                { accessorKey: "scheduledDate", header: "Scheduled Date" },
                { accessorKey: "mechanic", header: "Mechanic" },
                { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge status={row.getValue("status")} /> }
              ]}
              data={maintenance}
              showSearch={false}
              emptyTitle="No maintenance records found"
              emptyDescription="This vehicle has no pending or completed maintenance logs."
            />
          </Card>
        )}

        {activeTab === "fuel" && (
          <Card title="Refueling logs" subtitle="Fuel invoices logged for this vehicle">
            <Table
              columns={[
                { accessorKey: "date", header: "Refuel Date" },
                { accessorKey: "liters", header: "Fuel Volume", cell: ({ row }) => `${row.getValue("liters")} L` },
                { accessorKey: "cost", header: "Fuel Cost", cell: ({ row }) => formatCost(row.getValue("cost")) },
                { accessorKey: "location", header: "Station Location" },
                { accessorKey: "odometer", header: "Odometer Read", cell: ({ row }) => formatOdo(row.getValue("odometer")) }
              ]}
              data={fuelLogs}
              showSearch={false}
              emptyTitle="No fuel logs found"
              emptyDescription="No fuel refueling receipts have been uploaded for this asset."
            />
          </Card>
        )}

        {activeTab === "history" && (
          <VehicleHistory history={history} />
        )}

        {activeTab === "documents" && (
          <VehicleDocuments documents={vehicle.documents} />
        )}

        {activeTab === "timeline" && (
          <Card title="Operations Timeline" subtitle="Chronological history logs">
            <VehicleTimeline vehicle={vehicle} />
          </Card>
        )}
      </div>
    </div>
  );
};

export default VehicleDetails;
