import React, { useState } from "react";
import { File, Download } from "lucide-react";
import { toast } from "sonner";
import FileUpload from "../FileUpload/FileUpload";
import Button from "../Button/Button";

export const DriverDocuments = ({ documents }) => {
  const [uploadedFiles, setUploadedFiles] = useState({});

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
    { key: "drivingLicense", label: "Driving License CDL File" },
    { key: "govId", label: "Government ID (SSN/Passport)" },
    { key: "medicalCert", label: "DOT Medical Examiner Certificate" },
    { key: "policeVerification", label: "Police Background Clearance" }
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
      {/* Listing column */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h4 style={{ fontFamily: "var(--font-accent)", fontWeight: 700, fontSize: "1.1rem" }}>Registered Files</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {docTypes.map((t) => {
            const doc = uploadedFiles[t.key]
              ? { name: uploadedFiles[t.key].name, size: `${(uploadedFiles[t.key].size / 1024).toFixed(0)} KB`, expiryDate: "N/A" }
              : documents?.[t.key];

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
                  <File size={20} style={{ color: "var(--primary)" }} />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>{t.label}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {doc ? `${doc.name} (${doc.size}) ${doc.expiryDate ? `• Expires: ${doc.expiryDate}` : ""}` : "No file uploaded"}
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
                    <Download size={14} />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload Zone */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h4 style={{ fontFamily: "var(--font-accent)", fontWeight: 700, fontSize: "1.1rem" }}>Upload Verification Document</h4>
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
                  subtext="PDF or scanned image up to 4MB"
                  maxSize={4 * 1024 * 1024}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDocuments;
