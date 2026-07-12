import React, { useState, useEffect } from "react";
import { ArrowLeft, Navigation, User, Truck, Package, Activity, Fuel, DollarSign, BarChart3, Calendar } from "lucide-react";
import tripService from "../../services/tripService";
import StatusBadge from "../StatusBadge/StatusBadge";
import Button from "../Button/Button";
import Card from "../Card/Card";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";
import TripFuel from "./TripFuel";
import TripExpenses from "./TripExpenses";
import TripStatistics from "./TripStatistics";
import TripTimeline from "./TripTimeline";

export const TripDetails = ({ tripId, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [trip, setTrip] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [expenses, setExpenses] = useState(null);
  const [fuel, setFuel] = useState(null);

  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    const fetchAllDetails = async () => {
      setLoading(true);
      try {
        const [tripData, timelineData, expData, fuelData] = await Promise.all([
          tripService.getTrip(tripId),
          tripService.getTripTimeline(tripId),
          tripService.getTripExpenses(tripId),
          tripService.getTripFuel(tripId)
        ]);

        setTrip(tripData);
        setTimeline(timelineData);
        setExpenses(expData);
        setFuel(fuelData);
      } catch (err) {
        console.error("Failed to load trip details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (tripId) {
      fetchAllDetails();
    }
  }, [tripId]);

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

  if (!trip) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h3 style={{ color: "var(--danger)" }}>Dispatch Record Error</h3>
        <p style={{ color: "var(--text-secondary)" }}>Failed to retrieve data for this Trip ID.</p>
        <Button variant="primary" onClick={onBack} style={{ marginTop: "1rem" }}>Back to Trips</Button>
      </div>
    );
  }

  const capacityUsedRate = trip.vehicleCapacity > 0 ? Math.round((trip.cargoWeight / trip.vehicleCapacity) * 100) : 0;

  const tabs = [
    { id: "general", label: "Spec & Info", icon: <Navigation size={15} /> },
    { id: "timeline", label: "Timeline Logs", icon: <Activity size={15} /> },
    { id: "fuel", label: "Fuel Operations", icon: <Fuel size={15} /> },
    { id: "expenses", label: "Expenses Breakdown", icon: <DollarSign size={15} /> },
    { id: "statistics", label: "Logistics Stats", icon: <BarChart3 size={15} /> }
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
          Back to Trips
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <h2 style={{ fontFamily: "var(--font-accent)", fontSize: "1.75rem", fontWeight: 800 }}>
            Trip Details {trip.id}
          </h2>
          <StatusBadge status={trip.status} />
        </div>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
          Route: <strong style={{ color: "var(--text-primary)" }}>{trip.source} ➜ {trip.destination}</strong> • Priority: <strong>{trip.priority}</strong>
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
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Info grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
              
              {/* Trip spec */}
              <Card title="Trip Information" subtitle="Scheduling details">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.9rem" }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, display: "block" }}>ROUTE RANGE</span>
                    <strong>{trip.plannedDistance} miles</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, display: "block" }}>PLANNED DURATION</span>
                    <strong>{trip.expectedDuration} hours</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, display: "block" }}>DISPATCH DATE</span>
                    <strong>{trip.dispatchDate || "Pending Dispatch"}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, display: "block" }}>EST COMPLETION</span>
                    <strong>{trip.expectedCompletion || "Pending Dispatch"}</strong>
                  </div>
                </div>
                {trip.notes && (
                  <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border-color)", fontSize: "0.85rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "0.125rem" }}>INSTRUCTIONS</span>
                    <p style={{ color: "var(--text-secondary)", lineHeight: 1.4 }}>{trip.notes}</p>
                  </div>
                )}
              </Card>

              {/* Cargo Information */}
              <Card title="Cargo Details" subtitle="Payload specifications">
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>CARGO PAYLOAD</span>
                    <strong style={{ fontSize: "0.95rem" }}>{trip.cargoDescription}</strong>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.9rem" }}>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, display: "block" }}>PAYLOAD WEIGHT</span>
                      <strong>{trip.cargoWeight?.toLocaleString()} lbs</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, display: "block" }}>VEHICLE LIMIT</span>
                      <strong>{trip.vehicleCapacity?.toLocaleString()} lbs</strong>
                    </div>
                  </div>

                  {/* Weight Progress Bar */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginTop: "0.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: 700 }}>
                      <span>Payload Limit Utilized</span>
                      <span style={{ color: capacityUsedRate > 100 ? "var(--danger)" : "var(--primary)" }}>{capacityUsedRate}%</span>
                    </div>
                    <div style={{ height: "6px", backgroundColor: "var(--bg-tertiary)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                      <div style={{ width: `${Math.min(capacityUsedRate, 100)}%`, backgroundColor: capacityUsedRate > 100 ? "var(--danger)" : "var(--primary)", height: "100%" }} />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Vehicle Information */}
              <Card title="Assigned Vehicle" subtitle="Fleet asset details">
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>FLEET UNIT NAME</span>
                    <strong style={{ fontSize: "0.95rem" }}>{trip.vehicle}</strong>
                  </div>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.9rem" }}>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, display: "block" }}>ACQUISITION STATUS</span>
                      <strong style={{ color: "var(--primary)" }}>Active</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, display: "block" }}>LOAD LIMIT</span>
                      <strong>{trip.vehicleCapacity?.toLocaleString()} lbs</strong>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Driver Information */}
              <Card title="Assigned Operator" subtitle="Driver compliance stats">
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>OPERATOR NAME</span>
                    <strong style={{ fontSize: "0.95rem" }}>{trip.driver}</strong>
                  </div>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.9rem" }}>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, display: "block" }}>LICENSE CREDENTIALS</span>
                      <strong>Class A CDL</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, display: "block" }}>SAFETY COMPLIANCE</span>
                      <strong style={{ color: "var(--success)" }}>98%</strong>
                    </div>
                  </div>
                </div>
              </Card>

            </div>
          </div>
        )}

        {activeTab === "timeline" && (
          <Card title="Transport Milestones" subtitle="Live tracking timeline logs">
            <TripTimeline timeline={timeline} status={trip.status} />
          </Card>
        )}

        {activeTab === "fuel" && <TripFuel fuel={fuel} />}

        {activeTab === "expenses" && <TripExpenses expenses={expenses} />}

        {activeTab === "statistics" && <TripStatistics stats={trip.stats} />}
      </div>
    </div>
  );
};

export default TripDetails;
