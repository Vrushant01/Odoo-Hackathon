import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import {
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  AlertOctagon,
  CheckCircle2,
  Route,
  Activity,
  Compass,
  FileText,
  ShieldAlert,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Link
} from "lucide-react";
import StatusBadge from "../StatusBadge/StatusBadge";
import Button from "../Button/Button";
import EmptyState from "../EmptyState/EmptyState";
import styles from "./DriverTable.module.css";
import tableStyles from "../Table/Table.module.css";

export const DriverTable = ({
  data = [],
  totalCount = 0,
  isLoading = false,
  selectedIds = [],
  toggleSelectRow,
  toggleSelectAll,
  allVisibleIds = [],
  onView,
  onEdit,
  onDelete,
  onSuspend,
  onActivate,
  bulkDelete,
  bulkExport,
  sorting,
  setSorting,
  pagination,
  setPagination,
  pageCount
}) => {
  const navigate = useNavigate();

  const [activeMenuId, setActiveMenuId] = useState(null);
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);

  const menuRef = useRef(null);
  const visibilityRef = useRef(null);

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
      if (visibilityRef.current && !visibilityRef.current.contains(e.target)) {
        setShowVisibilityMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Validation warnings check helpers
  const getLicenseExpiryState = (expiryDate) => {
    if (!expiryDate) return "valid";
    const today = new Date();
    const exp = new Date(expiryDate);
    if (exp < today) return "expired";

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    if (exp <= thirtyDaysFromNow) return "soon";

    return "valid";
  };

  const getSafetyScoreColor = (score) => {
    if (score < 80) return "var(--danger)";
    if (score < 90) return "var(--warning)";
    return "var(--success)";
  };

  // Define table columns
  const columns = [
    { id: "select", enableHiding: false },
    { accessorKey: "avatar", header: "Photo" },
    { accessorKey: "name", header: "Driver Name" },
    { accessorKey: "licenseNumber", header: "License Number" },
    { accessorKey: "licenseCategory", header: "License Category" },
    { accessorKey: "phone", header: "Phone Number" },
    { accessorKey: "email", header: "Email Address" },
    { accessorKey: "assignedVehicle", header: "Assigned Vehicle" },
    { accessorKey: "currentTrip", header: "Current Trip" },
    { accessorKey: "safetyScore", header: "Safety Score" },
    { accessorKey: "licenseExpiry", header: "License Expiry" },
    { accessorKey: "status", header: "Status" }
  ];

  // Column Visibility state
  const [columnVisibility, setColumnVisibility] = useState({
    select: true,
    avatar: true,
    name: true,
    licenseNumber: true,
    licenseCategory: false,
    phone: true,
    email: false,
    assignedVehicle: true,
    currentTrip: false,
    safetyScore: true,
    licenseExpiry: true,
    status: true
  });

  const table = useReactTable({
    data,
    columns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel()
  });

  const handleSortChange = (field) => {
    setSorting((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc"
    }));
  };

  const getSortIcon = (field) => {
    if (sorting.field !== field) return <ArrowUpDown size={12} style={{ opacity: 0.4 }} />;
    return sorting.order === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />;
  };

  const isAllSelected = allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedIds.includes(id));

  return (
    <div className={tableStyles.tableContainer}>
      {/* Visibility Toolbar and Bulk Actions */}
      <div className={styles.headerRow}>
        <div className={styles.leftSection}>
          {selectedIds.length > 0 && (
            <div className={styles.bulkBar}>
              <span className={styles.bulkText}>{selectedIds.length} drivers selected</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => bulkExport("csv")}
                startIcon={<span style={{ display: "inline-flex", transform: "scale(0.85)" }}>📄</span>}
              >
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => bulkExport("pdf")}
                startIcon={<span style={{ display: "inline-flex", transform: "scale(0.85)" }}>📁</span>}
              >
                PDF
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={bulkDelete}
                startIcon={<Trash2 size={12} />}
              >
                Delete Selected
              </Button>
            </div>
          )}
        </div>

        <div className={styles.rightSection}>
          <div className={styles.visibilityWrapper} ref={visibilityRef}>
            <Button
              variant="outline"
              onClick={() => setShowVisibilityMenu(!showVisibilityMenu)}
              endIcon={<ChevronDown size={14} />}
            >
              Toggle Columns
            </Button>
            {showVisibilityMenu && (
              <div className={styles.visibilityMenu}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", paddingBottom: "0.25rem", borderBottom: "1px solid var(--border-color)" }}>
                  Visible Columns:
                </span>
                {table.getAllLeafColumns().map((column) => {
                  if (column.id === "select") return null;
                  return (
                    <label key={column.id} className={styles.visibilityItem}>
                      <input
                        type="checkbox"
                        className={styles.visibilityCheckbox}
                        checked={column.getIsVisible()}
                        onChange={column.getToggleVisibilityHandler()}
                      />
                      {column.id === "licenseNumber" ? "License Number" :
                       column.id === "licenseCategory" ? "License Category" :
                       column.id === "assignedVehicle" ? "Assigned Vehicle" :
                       column.id === "currentTrip" ? "Current Trip" :
                       column.id === "safetyScore" ? "Safety Score" :
                       column.id === "licenseExpiry" ? "License Expiry" :
                       column.id}
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Table view */}
      <div className={tableStyles.tableWrapper}>
        {isLoading ? (
          <div className={tableStyles.loadingOverlay}>
            <div className={tableStyles.spinner} />
            <p>Loading driver roster...</p>
          </div>
        ) : data.length === 0 ? (
          <EmptyState
            title="No drivers found"
            description="No logistics operators match your current filters or searches."
          />
        ) : (
          <table className={tableStyles.table}>
            <thead className={tableStyles.thead}>
              <tr>
                <th className={`${tableStyles.th} ${styles.checkboxCell}`}>
                  <input
                    type="checkbox"
                    className={styles.visibilityCheckbox}
                    checked={isAllSelected}
                    onChange={(e) => toggleSelectAll(e.target.checked, allVisibleIds)}
                  />
                </th>

                {table.getVisibleFlatColumns().map((column) => {
                  if (column.id === "select") return null;
                  const isSortable = column.id !== "avatar" && column.id !== "actions";

                  return (
                    <th key={column.id} className={tableStyles.th}>
                      {isSortable ? (
                        <div
                          className={tableStyles.sortableHeader}
                          onClick={() => handleSortChange(column.id)}
                        >
                          {column.id === "licenseNumber" ? "License Number" :
                           column.id === "licenseCategory" ? "License Category" :
                           column.id === "assignedVehicle" ? "Assigned Vehicle" :
                           column.id === "currentTrip" ? "Current Trip" :
                           column.id === "safetyScore" ? "Safety Score" :
                           column.id === "licenseExpiry" ? "License Expiry" :
                           column.id}
                          {getSortIcon(column.id)}
                        </div>
                      ) : (
                        column.id === "avatar" ? "Photo" : column.id
                      )}
                    </th>
                  );
                })}
                <th className={`${tableStyles.th} ${styles.actionCell}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => {
                const expiryState = getLicenseExpiryState(row.licenseExpiry);
                let rowClass = "";
                if (expiryState === "expired") rowClass = styles.expiredRow;
                else if (expiryState === "soon") rowClass = styles.warningRow;

                return (
                  <tr key={row.id} className={`${tableStyles.tr} ${rowClass}`}>
                    <td className={styles.checkboxCell}>
                      <input
                        type="checkbox"
                        className={styles.visibilityCheckbox}
                        checked={selectedIds.includes(row.id)}
                        onChange={() => toggleSelectRow(row.id)}
                      />
                    </td>

                    {table.getVisibleFlatColumns().map((column) => {
                      if (column.id === "select") return null;

                      return (
                        <td key={column.id} className={tableStyles.td}>
                          {column.id === "avatar" ? (
                            <img src={row.avatar} alt={row.name} className={styles.avatar} />
                          ) : column.id === "name" ? (
                            <span
                              onClick={() => onView(row.id)}
                              style={{ fontWeight: 700, color: "var(--primary)", cursor: "pointer" }}
                            >
                              {row.name}
                            </span>
                          ) : column.id === "status" ? (
                            <StatusBadge status={row.status} />
                          ) : column.id === "safetyScore" ? (
                            <strong style={{ color: getSafetyScoreColor(row.safetyScore) }}>
                              {row.safetyScore}%
                            </strong>
                          ) : column.id === "licenseExpiry" ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                              <span>{row.licenseExpiry}</span>
                              {expiryState === "expired" && <ShieldAlert size={14} style={{ color: "var(--danger)" }} title="License Expired" />}
                              {expiryState === "soon" && <ShieldAlert size={14} style={{ color: "var(--warning)" }} title="Expires Soon (<30d)" />}
                            </div>
                          ) : (
                            row[column.id] || <span style={{ color: "var(--text-muted)" }}>None</span>
                          )}
                        </td>
                      );
                    })}

                    {/* Actions Menu */}
                    <td className={`${tableStyles.td} ${styles.actionCell}`}>
                      <div style={{ position: "relative", display: "inline-block" }}>
                        <button
                          type="button"
                          onClick={() => setActiveMenuId(activeMenuId === row.id ? null : row.id)}
                          style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "0.25rem", borderRadius: "var(--radius-xs)" }}
                        >
                          <MoreVertical size={18} />
                        </button>

                        {activeMenuId === row.id && (
                          <div
                            ref={menuRef}
                            style={{
                              position: "absolute",
                              right: "100%",
                              top: 0,
                              width: "180px",
                              backgroundColor: "var(--bg-secondary)",
                              border: "1px solid var(--border-color)",
                              borderRadius: "var(--radius-md)",
                              boxShadow: "var(--shadow-xl)",
                              zIndex: 85,
                              overflow: "hidden",
                              display: "flex",
                              flexDirection: "column",
                              marginRight: "0.5rem"
                            }}
                          >
                            <button
                              type="button"
                              className={tableStyles.pageButton}
                              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1rem", border: "none", width: "100%", background: "none", textAlign: "left", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}
                              onClick={() => { onView(row.id); setActiveMenuId(null); }}
                            >
                              <Eye size={14} /> View Details
                            </button>

                            <button
                              type="button"
                              className={tableStyles.pageButton}
                              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1rem", border: "none", width: "100%", background: "none", textAlign: "left", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}
                              onClick={() => { onEdit(row.id); setActiveMenuId(null); }}
                            >
                              <Edit2 size={14} /> Edit Profile
                            </button>

                            {row.status === "Suspended" ? (
                              <button
                                type="button"
                                className={tableStyles.pageButton}
                                style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1rem", border: "none", width: "100%", background: "none", textAlign: "left", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", color: "var(--success)" }}
                                onClick={() => { onActivate(row.id); setActiveMenuId(null); }}
                              >
                                <CheckCircle2 size={14} /> Activate Driver
                              </button>
                            ) : (
                              <button
                                type="button"
                                className={tableStyles.pageButton}
                                style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1rem", border: "none", width: "100%", background: "none", textAlign: "left", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", color: "var(--warning)" }}
                                onClick={() => { onSuspend(row.id); setActiveMenuId(null); }}
                              >
                                <AlertOctagon size={14} /> Suspend Driver
                              </button>
                            )}

                            <button
                              type="button"
                              className={tableStyles.pageButton}
                              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1rem", border: "none", width: "100%", background: "none", textAlign: "left", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", color: "var(--danger)" }}
                              onClick={() => { onDelete(row.id); setActiveMenuId(null); }}
                            >
                              <Trash2 size={14} /> Delete Profile
                            </button>

                            <div style={{ height: "1px", backgroundColor: "var(--border-color)", margin: "0.25rem 0" }} />

                            <button
                              type="button"
                              className={tableStyles.pageButton}
                              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1rem", border: "none", width: "100%", background: "none", textAlign: "left", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-muted)" }}
                              onClick={() => { navigate(`/vehicles?assign=${row.id}`); setActiveMenuId(null); }}
                            >
                              <Link size={14} /> Assign Vehicle
                            </button>

                            <button
                              type="button"
                              className={tableStyles.pageButton}
                              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1rem", border: "none", width: "100%", background: "none", textAlign: "left", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-muted)" }}
                              onClick={() => { navigate(`/trips?driver=${row.name}`); setActiveMenuId(null); }}
                            >
                              <Route size={14} /> View Trips
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {!isLoading && data.length > 0 && (
        <div className={tableStyles.pagination}>
          <div className={tableStyles.pageInfo}>
            Showing {pagination.pageIndex * pagination.pageSize + 1} to {Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalCount)} of {totalCount} operators
          </div>

          <div className={tableStyles.paginationActions}>
            <button
              className={tableStyles.pageButton}
              onClick={() => setPagination(prev => ({ ...prev, pageIndex: 0 }))}
              disabled={pagination.pageIndex === 0}
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              className={tableStyles.pageButton}
              onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
              disabled={pagination.pageIndex === 0}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: pageCount }, (_, i) => i).map((pageIdx) => (
              <button
                key={pageIdx}
                className={`${tableStyles.pageButton} ${
                  pagination.pageIndex === pageIdx ? tableStyles.activePageButton : ""
                }`}
                onClick={() => setPagination(prev => ({ ...prev, pageIndex: pageIdx }))}
              >
                {pageIdx + 1}
              </button>
            ))}

            <button
              className={tableStyles.pageButton}
              onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
              disabled={pagination.pageIndex >= pageCount - 1}
            >
              <ChevronRight size={16} />
            </button>
            <button
              className={tableStyles.pageButton}
              onClick={() => setPagination(prev => ({ ...prev, pageIndex: pageCount - 1 }))}
              disabled={pagination.pageIndex >= pageCount - 1}
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverTable;
