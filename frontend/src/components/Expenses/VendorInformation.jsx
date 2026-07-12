import React from "react";
import { User, Mail, Phone, Award } from "lucide-react";
import Card from "../Card/Card";

export const VendorInformation = ({ vendorInfo }) => {
  if (!vendorInfo) return null;

  const { name = "N/A", contact = "N/A", email = "N/A", rating = "N/A" } = vendorInfo;

  return (
    <Card title="Billing Vendor Credentials" subtitle="Vendor contact and audit metrics">
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.9rem" }}>
        
        {/* Name */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <User size={16} style={{ color: "var(--primary)" }} />
          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block" }}>COMPANY NAME</span>
            <strong>{name}</strong>
          </div>
        </div>

        {/* Contact */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Phone size={16} style={{ color: "var(--primary)" }} />
          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block" }}>CONTACT PHONE</span>
            <strong>{contact}</strong>
          </div>
        </div>

        {/* Email */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Mail size={16} style={{ color: "var(--primary)" }} />
          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block" }}>BILLING EMAIL</span>
            <strong>{email}</strong>
          </div>
        </div>

        {/* Rating */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Award size={16} style={{ color: "var(--success)" }} />
          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block" }}>VENDOR CLASSIFICATION</span>
            <strong style={{ color: "var(--success)" }}>{rating}</strong>
          </div>
        </div>

      </div>
    </Card>
  );
};

export default VendorInformation;
