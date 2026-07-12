import React, { useState, useEffect } from "react";
import { ArrowLeft, Wallet, User, Calendar, FileText, DollarSign, Activity, Settings, HelpCircle, Navigation } from "lucide-react";
import expenseService from "../../services/expenseService";
import StatusBadge from "../StatusBadge/StatusBadge";
import Button from "../Button/Button";
import Card from "../Card/Card";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";
import ExpenseTimeline from "./ExpenseTimeline";
import TripExpenses from "./TripExpenses";
import VendorInformation from "./VendorInformation";

export const ExpenseDetails = ({ expenseId, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState(null);
  
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    const fetchAllDetails = async () => {
      setLoading(true);
      try {
        const data = await expenseService.getExpense(expenseId);
        setRecord(data);
      } catch (err) {
        console.error("Failed to load expense details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (expenseId) {
      fetchAllDetails();
    }
  }, [expenseId]);

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
        <h3 style={{ color: "var(--danger)" }}>Expense Statement Error</h3>
        <p style={{ color: "var(--text-secondary)" }}>Failed to retrieve data for this expense ID.</p>
        <Button variant="primary" onClick={onBack} style={{ marginTop: "1rem" }}>Back to Expenses Ledger</Button>
      </div>
    );
  }

  const tabs = [
    { id: "general", label: "Invoice Specs", icon: <Navigation size={15} /> },
    { id: "timeline", label: "Timeline logs", icon: <Activity size={15} /> },
    { id: "trip", label: "Associated Trip", icon: <DollarSign size={15} /> }
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
          Back to Expenses Ledger
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <h2 style={{ fontFamily: "var(--font-accent)", fontSize: "1.75rem", fontWeight: 800 }}>
            Expense Details {record.id}
          </h2>
          <StatusBadge status={record.status} />
        </div>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
          Vendor: <strong style={{ color: "var(--text-primary)" }}>{record.vendor}</strong> • Amount: <strong>${record.amount?.toFixed(2)}</strong>
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
            <Card title="Billing Invoice Spec" subtitle="Invoice details">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>BILLING VENDOR</span>
                  <strong style={{ fontSize: "0.95rem" }}>{record.vendor}</strong>
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
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>INVOICE DATE</span>
                  <strong style={{ fontSize: "0.95rem" }}>{record.date}</strong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>BILLING AMOUNT</span>
                  <strong style={{ fontSize: "0.95rem" }}>${record.amount?.toFixed(2)}</strong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>EXPENSE CATEGORY</span>
                  <strong style={{ fontSize: "0.95rem" }}>{record.type}</strong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>VEHICLE ASSIGNED</span>
                  <strong style={{ fontSize: "0.95rem" }}>{record.vehicle}</strong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>ASSOCIATED TRIP ID</span>
                  <strong style={{ fontSize: "0.95rem" }}>{record.tripId}</strong>
                </div>
              </div>

              {record.remarks && (
                <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--border-color)" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "0.25rem" }}>
                    BILLING REMARKS
                  </span>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>{record.remarks}</p>
                </div>
              )}
            </Card>

            {/* Vendor Profile Brief */}
            <VendorInformation vendorInfo={record.vendorInfo} />

          </div>
        )}

        {activeTab === "timeline" && (
          <Card title="Billing Progression" subtitle="Expense verification milestones">
            <ExpenseTimeline date={record.date} />
          </Card>
        )}

        {activeTab === "trip" && (
          <TripExpenses tripBreakdown={record.tripBreakdown} />
        )}
      </div>
    </div>
  );
};

export default ExpenseDetails;
