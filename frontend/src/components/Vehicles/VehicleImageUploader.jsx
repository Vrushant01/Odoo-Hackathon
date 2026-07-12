import React, { useRef, useState } from "react";
import { Camera, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import Button from "../Button/Button";

export const VehicleImageUploader = ({ value, onChange }) => {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(value);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      if (onChange) onChange(file);
      toast.success("Vehicle profile thumbnail updated!");
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreviewUrl(null);
    if (onChange) onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.info("Vehicle profile thumbnail removed.");
  };

  const triggerUpload = () => {
    fileInputRef.current.click();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", width: "100%" }}>
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* Image Preview Window */}
      <div style={{
        width: "150px",
        height: "150px",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-color)",
        overflow: "hidden",
        position: "relative",
        background: "var(--bg-tertiary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "var(--shadow-sm)"
      }}>
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Vehicle profile"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)" }}>
            <Camera size={32} />
            <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>No Image</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Button
          variant="outline"
          size="sm"
          onClick={triggerUpload}
          startIcon={<RefreshCw size={12} />}
        >
          {previewUrl ? "Replace" : "Upload"}
        </Button>
        {previewUrl && (
          <Button
            variant="danger"
            size="sm"
            onClick={handleRemove}
            startIcon={<Trash2 size={12} />}
            style={{ padding: "0.25rem 0.5rem" }}
          >
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};

export default VehicleImageUploader;
