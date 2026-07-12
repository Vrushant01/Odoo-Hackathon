import React, { useState, useEffect } from "react";
import { ArrowLeft, User, Calendar, FileText, Wrench, Fuel, DollarSign, Activity, Settings, Heart, Award } from "lucide-react";
import { toast } from "sonner";
import driverService from "../../services/driverService";
import StatusBadge from "../StatusBadge/StatusBadge";
import Button from "../Button/Button";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";
import DriverProfile from "./DriverProfile";
import DriverTrips from "./DriverTrips";
import DriverPerformance from "./DriverPerformance";
import DriverDocuments from "./DriverDocuments";
import DriverTimeline from "./DriverTimeline";

export const DriverDetails = ({ driverId, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [driver, setDriver] = useState(null);
  const [trips, setTrips] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [timeline, setTimeline] = useState([]);
  
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    const fetchAllDetails = async () => {
      setLoading(true);
      try {
        const [drvData, tripsData, perfData, timelineData] = await Promise.all([
          driverService.getDriver(driverId),
          driverService.getDriverTrips(driverId),
          driverService.getDriverPerformance(driverId),
          driverService.getDriverTimeline(driverId)
        ]);

        if (!drvData) {
          toast.error("Driver profile not found.");
          onBack();
          return;
        }

        setDriver(drvData);
        setTrips(tripsData);
        setPerformance(perfData);
        setTimeline(timelineData);
      } catch (err) {
        console.error("Failed to load driver details:", err);
        toast.error("Driver profile not found.");
        onBack();
      } finally {
        setLoading(false);
      }
    };

    if (driverId) {
      fetchAllDetails();
    }
  }, [driverId, onBack]);

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

  if (!driver) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h3 style={{ color: "var(--danger)" }}>Driver Profile Error</h3>
        <p style={{ color: "var(--text-secondary)" }}>Failed to retrieve data for this driver ID.</p>
        <Button variant="primary" onClick={onBack} style={{ marginTop: "1rem" }}>Back to Drivers</Button>
      </div>
    );
  }

  const tabs = [
    { id: "general", label: "Spec & Info", icon: <User size={15} /> },
    { id: "trips", label: "Trip History", icon: <Activity size={15} /> },
    { id: "performance", label: "Safety & Performance", icon: <Award size={15} /> },
    { id: "documents", label: "Documents", icon: <FileText size={15} /> },
    { id: "timeline", label: "Timeline Logs", icon: <Activity size={15} /> }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Header Row */}
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
          Back to Drivers
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img
            src={driver.avatar}
            alt={driver.name}
            style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--primary)" }}
          />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <h2 style={{ fontFamily: "var(--font-accent)", fontSize: "1.75rem", fontWeight: 800, margin: 0 }}>
                {driver.name}
              </h2>
              <StatusBadge status={driver.status} />
            </div>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", margin: "0.25rem 0 0 0" }}>
              Email: <strong>{driver.email}</strong> • Experience: <strong>{driver.experience} Years</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
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
        {activeTab === "general" && <DriverProfile driver={driver} />}
        {activeTab === "trips" && <DriverTrips trips={trips} />}
        {activeTab === "performance" && <DriverPerformance performance={performance} />}
        {activeTab === "documents" && <DriverDocuments documents={driver.documents} />}
        {activeTab === "timeline" && <DriverTimeline timeline={timeline} driver={driver} />}
      </div>
    </div>
  );
};

export default DriverDetails;
