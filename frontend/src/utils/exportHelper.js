import { toast } from "sonner";

/**
 * Downloads a file from the backend API, attaching the authenticated token,
 * and triggers a browser download.
 * 
 * @param {string} entity - Name of the entity being exported (e.g. vehicles, drivers, trips, fuel, expenses, maintenance)
 * @param {string} format - File format (csv or pdf)
 * @param {Array<string>} ids - Optional list of selected document IDs to export
 */
export const performBulkExport = async (entity, format = "csv", ids = []) => {
  const formatName = format.toLowerCase().trim();
  const entityName = entity.toLowerCase().trim();

  let url = `/export/${formatName}/${entityName}`;
  if (ids.length > 0) {
    url += `?ids=${ids.join(",")}`;
  }

  const toastId = toast.loading(`Generating ${formatName.toUpperCase()} export for ${entityName}...`);

  try {
    const token = localStorage.getItem("transitops_token") || sessionStorage.getItem("transitops_token");
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1"}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to download export file.");
    
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${entityName}_export_${Date.now()}.${formatName}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);

    toast.success(`${formatName.toUpperCase()} export downloaded successfully!`, { id: toastId });
  } catch (err) {
    console.error("Export operation failed:", err);
    toast.error("Export operation failed. Please check backend connection.", { id: toastId });
  }
};

export default performBulkExport;
