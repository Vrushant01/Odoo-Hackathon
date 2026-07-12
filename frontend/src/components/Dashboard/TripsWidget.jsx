import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Compass, Truck, User } from "lucide-react";
import Card from "../Card/Card";
import StatusBadge from "../StatusBadge/StatusBadge";

export const TripsWidget = ({ trips }) => {
  const navigate = useNavigate();

  // Filter only active dispatches
  const activeTrips = trips ? trips.filter((t) => t.status === "Active") : [];

  const handleTripClick = (id) => {
    navigate(`/trips?id=${id}`);
  };

  return (
    <Card
      title="Active Dispatches"
      subtitle="Real-time transit operations"
      headerAction={<Compass size={18} style={{ color: "var(--primary)" }} />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxHeight: "360px", overflowY: "auto", paddingRight: "0.25rem" }}>
        {activeTrips.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            No active trips matching current filters.
          </div>
        ) : (
          activeTrips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => handleTripClick(trip.id)}
              className="glass-panel interactive"
              style={{
                padding: "1rem",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                border: "1px solid var(--border-color)",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem"
              }}
            >
              {/* Top row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary)" }}>
                  {trip.id}
                </span>
                <StatusBadge status={trip.status} />
              </div>

              {/* Source to Destination */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", fontWeight: 600 }}>
                <span>{trip.source}</span>
                <ArrowRight size={14} style={{ color: "var(--text-muted)" }} />
                <span>{trip.destination}</span>
              </div>

              {/* Driver & Vehicle */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <User size={12} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {trip.driver}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <Truck size={12} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {trip.vehicle}
                  </span>
                </div>
              </div>

              {/* Footer specs */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "0.5rem",
                borderTop: "1px solid var(--border-color)",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                fontWeight: 600
              }}>
                <span>Loads: {trip.cargoWeight}</span>
                <span>ETA: {trip.expectedCompletion ? trip.expectedCompletion.split(" ")[1] : "N/A"}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default TripsWidget;
