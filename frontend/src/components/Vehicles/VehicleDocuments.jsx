import React, { useState } from "react";
import { File, Download, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import FileUpload from "../FileUpload/FileUpload";
import Button from "../Button/Button";

export const VehicleDocuments = ({ documents }) => {
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
    { key: "rcBook", label: "Registration Book (RC)" },
    { key: "insurance", label: "Insurance Policy" },
    { key: "pollution", label: "Pollution (Emissions) Cert" },
    { key: "fitness", label: "Vehicle Fitness Certificate" }
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
      {/* Existing documents listing */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h4 style={{ fontFamily: "var(--font-accent)", fontWeight: 700, fontSize: "1.1rem" }}>Current Certificates</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {docTypes.map((t) => {
            const doc = uploadedFiles[t.key]
              ? { name: uploadedFiles[t.key].name, size: `${(uploadedFiles[t.key].size / 1024).toFixed(0)} KB`, issueDate: new Date().toISOString().split("T")[0] }
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
                      {doc ? `${doc.name} (${doc.size}) • Issued: ${doc.issueDate}` : "Not uploaded yet"}
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
        <h4 style={{ fontFamily: "var(--font-accent)", fontWeight: 700, fontSize: "1.1rem" }}>Upload New Certificate</h4>
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
  );
};

export default VehicleDocuments;
