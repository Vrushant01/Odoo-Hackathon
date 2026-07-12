import React, { useState, useEffect } from "react";
import { ArrowLeft, Wrench, User, Calendar, FileText, DollarSign, Activity, Settings, HelpCircle, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import maintenanceService from "../../services/maintenanceService";
import StatusBadge from "../StatusBadge/StatusBadge";
import Button from "../Button/Button";
import Card from "../Card/Card";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";
import MaintenanceTimeline from "./MaintenanceTimeline";
import MaintenanceHistory from "./MaintenanceHistory";
import MaintenanceCostSummary from "./MaintenanceCostSummary";
import FileUpload from "../FileUpload/FileUpload";

export const MaintenanceDetails = ({ recordId, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [history, setHistory] = useState([]);
  
  const [activeTab, setActiveTab] = useState("general");
  const [uploadedFiles, setUploadedFiles] = useState({});

  useEffect(() => {
    const fetchAllDetails = async () => {
      setLoading(true);
      try {
        const maintData = await maintenanceService.getMaintenanceById(recordId);
        setRecord(maintData);

        const [timelineData, historyData] = await Promise.all([
          maintenanceService.getMaintenanceTimeline(recordId),
          maintenanceService.getVehicleMaintenance(maintData.plateNumber)
        ]);

        setTimeline(timelineData);
        setHistory(historyData);
      } catch (err) {
        console.error("Failed to load maintenance details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (recordId) {
      fetchAllDetails();
    }
  }, [recordId]);

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
        <h3 style={{ color: "var(--danger)" }}>Worksheet Record Error</h3>
        <p style={{ color: "var(--text-secondary)" }}>Failed to retrieve data for this record ID.</p>
        <Button variant="primary" onClick={onBack} style={{ marginTop: "1rem" }}>Back to Maintenance</Button>
      </div>
    );
  }

  const handleDownload = (docName) => {
    toast.success(`Downloading ${docName} (Mock)...`);
  };

  const handleFileUpload = (type, file) => {
    if (file) {
      setUploadedFiles((prev) => ({ ...prev, [type]: file }));
      toast.success(`${file.name} uploaded for ${type.toUpperCase()} successfully.`);
    } else {
      setUploadedFiles((prev) => ({ ...prev, [type]: null }));
    }
  };

  const docTypes = [
    { key: "invoice", label: "Workshop Invoice Billing" },
    { key: "serviceReport", label: "Completed Service Report" },
    { key: "inspectionReport", label: "Failed/Inspection Audit Sheet" },
    { key: "warranty", label: "Parts Warranty Certificates" }
  ];

  const tabs = [
    { id: "general", label: "Spec & Info", icon: <Wrench size={15} /> },
    { id: "timeline", label: "Timeline Logs", icon: <Activity size={15} /> },
    { id: "costs", label: "Cost Breakdown", icon: <DollarSign size={15} /> },
    { id: "history", label: "Vehicle History", icon: <Activity size={15} /> },
    { id: "documents", label: "Documents", icon: <FileText size={15} /> }
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
          Back to Maintenance
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <h2 style={{ fontFamily: "var(--font-accent)", fontSize: "1.75rem", fontWeight: 800 }}>
            Worksheet {record.id}
          </h2>
          <StatusBadge status={record.status} />
        </div>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
          Vehicle: <strong style={{ color: "var(--text-primary)" }}>{record.vehicle}</strong> • Service: <strong>{record.type}</strong>
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
            <Card title="Servicing Worksheet Information" subtitle="Record details">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>WORKSHOP CENTER</span>
                  <strong style={{ fontSize: "0.95rem" }}>{record.workshop}</strong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>ASSIGNED MECHANIC</span>
                  <strong style={{ fontSize: "0.95rem" }}>{record.mechanic}</strong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>SERVICE TYPE</span>
                  <strong style={{ fontSize: "0.95rem" }}>{record.type}</strong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>CLASSIFICATION</span>
                  <strong style={{ fontSize: "0.95rem" }}>{record.category}</strong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>SCHEDULED DATE</span>
                  <strong style={{ fontSize: "0.95rem" }}>{record.scheduledDate}</strong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>ESTIMATED COMPLETION</span>
                  <strong style={{ fontSize: "0.95rem" }}>{record.estimatedCompletion}</strong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>PARTS REQUIRED</span>
                  <strong style={{ fontSize: "0.95rem" }}>{record.partsRequired || "None"}</strong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>ESTIMATED BUDGET</span>
                  <strong style={{ fontSize: "0.95rem" }}>${record.cost?.toLocaleString()}</strong>
                </div>
              </div>

              {record.description && (
                <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--border-color)" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: "0.25rem" }}>
                    DIAGNOSTIC / DAMAGE NOTES
                  </span>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>{record.description}</p>
                </div>
              )}
            </Card>

            {/* Vehicle spec brief */}
            <Card title="Vehicle Specification" subtitle="Asset grounded details">
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>VEHICLE UNIT</span>
                  <strong>{record.vehicle}</strong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>REGISTRATION NUMBER</span>
                  <strong style={{ fontFamily: "monospace" }}>{record.plateNumber}</strong>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>GROUNDED STATUS</span>
                  <StatusBadge status={record.status === "In Progress" ? "In Shop" : "Available"} />
                </div>
              </div>
            </Card>

          </div>
        )}

        {activeTab === "timeline" && (
          <Card title="Shop Floor Progress" subtitle="Live tracking timeline logs">
            <MaintenanceTimeline timeline={timeline} status={record.status} />
          </Card>
        )}

        {activeTab === "costs" && (
          <MaintenanceCostSummary costSummary={record.costSummary} />
        )}

        {activeTab === "history" && (
          <Card title="Prior Servicing History" subtitle={`Maintenance logs for vehicle ${record.plateNumber}`}>
            <MaintenanceHistory history={history} />
          </Card>
        )}

        {activeTab === "documents" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h4 style={{ fontFamily: "var(--font-accent)", fontWeight: 700, fontSize: "1.1rem" }}>Invoices & Reports</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {docTypes.map((t) => {
                  const doc = uploadedFiles[t.key]
                    ? { name: uploadedFiles[t.key].name, size: `${(uploadedFiles[t.key].size / 1024).toFixed(0)} KB` }
                    : null;

                  return (
                    <div
                      key={t.key}
                      className="glass-panel"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.75rem 1rem",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--border-color)"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <FileText size={20} style={{ color: "var(--primary)" }} />
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>{t.label}</span>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            {doc ? `${doc.name} (${doc.size})` : "No document uploaded"}
                          </span>
                        </div>
                      </div>

                      {doc && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(doc.name)}
                          style={{ padding: "0.25rem" }}
                        >
                          <FileText size={14} />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h4 style={{ fontFamily: "var(--font-accent)", fontWeight: 700, fontSize: "1.1rem" }}>Upload Invoice / Certificate</h4>
              <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {docTypes.map((t) => (
                    <div key={t.key} style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)" }}>
                        {t.label}
                      </span>
                      <FileUpload
                        value={uploadedFiles[t.key]}
                        onChange={(file) => handleFileUpload(t.key, file)}
                        accept="application/pdf,image/*"
                        subtext="PDF or image up to 5MB"
                        maxSize={5 * 1024 * 1024}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceDetails;
