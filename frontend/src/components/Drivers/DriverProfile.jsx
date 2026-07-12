import React from "react";
import { User, Phone, MapPin, Calendar, Heart, ShieldAlert, Award } from "lucide-react";
import Card from "../Card/Card";

export const DriverProfile = ({ driver }) => {
  if (!driver) return null;

  const today = new Date();
  const expDate = new Date(driver.licenseExpiry);
  const diffTime = expDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isExpiringSoon = diffDays > 0 && diffDays <= 30;
  const isExpired = diffDays <= 0;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", alignItems: "start" }}>
      {/* Specifications */}
      <Card title="Personal & Licensing Information" subtitle="Bio and licensing specifications">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>FULL NAME</span>
            <strong style={{ fontSize: "0.95rem" }}>{driver.name}</strong>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>EMAIL ADDRESS</span>
            <strong style={{ fontSize: "0.95rem" }}>{driver.email}</strong>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>PHONE NUMBER</span>
            <strong style={{ fontSize: "0.95rem" }}>{driver.phone}</strong>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>EMERGENCY CONTACT</span>
            <strong style={{ fontSize: "0.95rem" }}>{driver.emergencyContact}</strong>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>LICENSE NUMBER</span>
            <strong style={{ fontSize: "0.95rem", fontFamily: "monospace" }}>{driver.licenseNumber}</strong>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>LICENSE CATEGORY</span>
            <strong style={{ fontSize: "0.95rem" }}>{driver.licenseCategory}</strong>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>LICENSE EXPIRY</span>
            <strong style={{ fontSize: "0.95rem", color: isExpired ? "var(--danger)" : isExpiringSoon ? "var(--warning)" : "var(--text-primary)" }}>
              {driver.licenseExpiry} {isExpired ? "(EXPIRED)" : isExpiringSoon ? `(Expires in ${diffDays}d)` : ""}
            </strong>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>DATE OF BIRTH</span>
            <strong style={{ fontSize: "0.95rem" }}>{driver.dob}</strong>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>BLOOD GROUP</span>
            <strong style={{ fontSize: "0.95rem", color: "var(--danger)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Heart size={14} fill="var(--danger)" />
              {driver.bloodGroup}
            </strong>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>JOINING DATE</span>
            <strong style={{ fontSize: "0.95rem" }}>{driver.joiningDate}</strong>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>EXPERIENCE</span>
            <strong style={{ fontSize: "0.95rem" }}>{driver.experience} Years</strong>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>ADDRESS</span>
            <strong style={{ fontSize: "0.95rem" }}>
              {driver.address}, {driver.city}, {driver.state}, {driver.country}
            </strong>
          </div>
        </div>

        {driver.notes && (
          <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--border-color)" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "0.25rem" }}>
              MEDICAL / OPERATIONAL NOTES
            </span>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>{driver.notes}</p>
          </div>
        )}
      </Card>

      {/* Assignment Card */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <Card title="Current Assignment" subtitle="Assigned transport assets">
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.5rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>ASSIGNED VEHICLE</span>
              <strong style={{ fontSize: "1rem" }}>{driver.assignedVehicle || "No Vehicle Assigned"}</strong>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>CURRENT DISPATCH</span>
              <strong style={{ fontSize: "1.05rem", color: "var(--primary)" }}>{driver.currentTrip || "Not Dispatched"}</strong>
            </div>
          </div>
        </Card>

        {/* Expiry warnings */}
        {(isExpired || isExpiringSoon) && (
          <div
            style={{
              padding: "1rem",
              borderRadius: "var(--radius-md)",
              backgroundColor: isExpired ? "var(--danger-light)" : "var(--warning-light)",
              border: `1px solid ${isExpired ? "var(--danger)" : "var(--warning)"}`,
              display: "flex",
              gap: "0.75rem",
              alignItems: "flex-start"
            }}
          >
            <ShieldAlert size={20} style={{ color: isExpired ? "var(--danger)" : "var(--warning)", flexShrink: 0 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <strong style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>
                {isExpired ? "License Expired!" : "License Expiring Soon"}
              </strong>
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.3 }}>
                {isExpired
                  ? "This driver's license has expired. The operator is legally barred from dispatches and active routes."
                  : `This driver's license is expiring in ${diffDays} days. Schedule a license renewal log immediately.`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverProfile;
