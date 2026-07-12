import React, { useState, useEffect } from "react";
import { ArrowLeft, Fuel, Navigation, User, Truck, DollarSign, Activity, Settings, Calendar } from "lucide-react";
import fuelService from "../../services/fuelService";
import Button from "../Button/Button";
import Card from "../Card/Card";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";
import FuelTimeline from "./FuelTimeline";
import FuelEfficiency from "./FuelEfficiency";
import VehicleFuelHistory from "./VehicleFuelHistory";

export const FuelDetails = ({ logId, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState(null);
  const [history, setHistory] = useState([]);
  
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    const fetchAllDetails = async () => {
      setLoading(true);
      try {
        const fuelData = await fuelService.getFuelLog(logId);
        setRecord(fuelData);

        // Derive plate number from vehicle name, e.g. "Mercedes Sprinter (FL-1278)" -> "FL-1278"
        const plate = fuelData.vehicle.match(/\(([^)]+)\)/)?.[1] || "";
        const historyData = await fuelService.getVehicleFuelHistory(plate);
        setHistory(historyData);
      } catch (err) {
        console.error("Failed to load fuel details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (logId) {
      fetchAllDetails();
    }
  }, [logId]);

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

  if (!record) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h3 style={{ color: "var(--danger)" }}>Fuel Log Error</h3>
        <p style={{ color: "var(--text-secondary)" }}>Failed to retrieve data for this fuel log ID.</p>
        <Button variant="primary" onClick={onBack} style={{ marginTop: "1rem" }}>Back to Fuel Ledger</Button>
      </div>
    );
  }

  const tabs = [
    { id: "general", label: "Invoice Specs", icon: <Navigation size={15} /> },
    { id: "efficiency", label: "Fuel Efficiency", icon: <Fuel size={15} /> },
    { id: "timeline", label: "Timeline logs", icon: <Activity size={15} /> },
    { id: "history", label: "Refuel History", icon: <Activity size={15} /> }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Back button */}
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
          Back to Fuel Ledger
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <h2 style={{ fontFamily: "var(--font-accent)", fontSize: "1.75rem", fontWeight: 800 }}>
            Fuel Log Details {record.id}
          </h2>
        </div>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
          Station: <strong style={{ color: "var(--text-primary)" }}>{record.fuelStation}</strong> • Quantity: <strong>{record.quantity} Liters</strong>
        </p>
      </div>

      {/* Tabs list */}
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

      {/* Tabs Content */}
      <div className="fade-in">
        {activeTab === "general" && (
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", alignItems: "start" }}>
            
            {/* General Specs */}
            <Card title="Refueling Invoice Spec" subtitle="Invoice details">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>FUEL STATION</span>
                  <strong style={{ fontSize: "0.95rem" }}>{record.fuelStation}</strong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>INVOICE NUMBER</span>
                  <strong style={{ fontSize: "0.95rem" }}>{record.invoiceNumber}</strong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>PAYMENT METHOD</span>
                  <strong style={{ fontSize: "0.95rem" }}>{record.paymentMethod}</strong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>REFUEL DATE</span>
                  <strong style={{ fontSize: "0.95rem" }}>{record.date}</strong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>VOLUME QUANTITY</span>
                  <strong style={{ fontSize: "0.95rem" }}>{record.quantity} Liters</strong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>UNIT PRICE</span>
                  <strong style={{ fontSize: "0.95rem" }}>${record.costPerUnit}/L</strong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>GRAND TOTAL</span>
                  <strong style={{ fontSize: "0.95rem" }}>${record.totalCost?.toFixed(2)}</strong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>ODOMETER READ</span>
                  <strong style={{ fontSize: "0.95rem" }}>{record.currentOdometer?.toLocaleString()} mi</strong>
                </div>
              </div>

              {record.remarks && (
                <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--border-color)" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "0.25rem" }}>
                    DIAGNOSTIC / REMARKS NOTES
                  </span>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>{record.remarks}</p>
                </div>
              )}
            </Card>

            {/* Asset profiles brief */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <Card title="Refueling Asset Profile" subtitle="Driver and Vehicle assigned">
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.9rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>VEHICLE UNIT</span>
                    <strong>{record.vehicle}</strong>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>OPERATOR DRIVER</span>
                    <strong>{record.driver}</strong>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>ACTIVE TRIP ID</span>
                    <strong style={{ color: "var(--primary)" }}>{record.tripId}</strong>
                  </div>
                </div>
              </Card>
            </div>

          </div>
        )}

        {activeTab === "efficiency" && (
          <FuelEfficiency efficiency={record.efficiency} />
        )}

        {activeTab === "timeline" && (
          <Card title="Billing Progression" subtitle="Refueling invoice milestones">
            <FuelTimeline date={record.date} />
          </Card>
        )}

        {activeTab === "history" && (
          <Card title="Prior Servicing History" subtitle={`Refuel records for vehicle`}>
            <VehicleFuelHistory history={history} />
          </Card>
        )}
      </div>
    </div>
  );
};

export default FuelDetails;
