import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import {
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  Wrench,
  CheckCircle2,
  AlertOctagon,
  Activity,
  Truck,
  ShieldAlert,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import StatusBadge from "../StatusBadge/StatusBadge";
import Button from "../Button/Button";
import EmptyState from "../EmptyState/EmptyState";
import styles from "./MaintenanceTable.module.css";
import tableStyles from "../Table/Table.module.css";

export const MaintenanceTable = ({
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
  onStart,
  onComplete,
  onCancel,
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

  const formatCost = (val) => `$${Number(val).toLocaleString()}`;

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "critical":
        return "var(--danger)";
      case "high":
        return "var(--warning)"; // Deep orange
      case "medium":
        return "var(--info)";
      case "low":
      default:
        return "var(--success)";
    }
  };

  // Define Columns
  const columns = [
    { id: "select", enableHiding: false },
    { accessorKey: "id", header: "W.O. Code" },
    { accessorKey: "vehicle", header: "Vehicle Unit" },
    { accessorKey: "type", header: "Service Type" },
    { accessorKey: "priority", header: "Priority" },
    { accessorKey: "workshop", header: "Workshop Center" },
    { accessorKey: "mechanic", header: "Assigned Mechanic" },
    { accessorKey: "scheduledDate", header: "Scheduled Date" },
    { accessorKey: "estimatedCompletion", header: "Est Completion" },
    { accessorKey: "status", header: "Status" }
  ];

  // Visibility state
  const [columnVisibility, setColumnVisibility] = useState({
    select: true,
    id: true,
    vehicle: true,
    type: true,
    priority: true,
    workshop: true,
    mechanic: true,
    scheduledDate: true,
    estimatedCompletion: false,
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
      {/* Bulk Toolbar */}
      <div className={styles.headerRow}>
        <div className={styles.leftSection}>
          {selectedIds.length > 0 && (
            <div className={styles.bulkBar}>
              <span className={styles.bulkText}>{selectedIds.length} worksheets selected</span>
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
                      {column.id === "id" ? "W.O. Code" :
                       column.id === "vehicle" ? "Vehicle Unit" :
                       column.id === "type" ? "Service Type" :
                       column.id === "scheduledDate" ? "Scheduled Date" :
                       column.id === "estimatedCompletion" ? "Est Completion" :
                       column.id}
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Table grid */}
      <div className={tableStyles.tableWrapper}>
        {isLoading ? (
          <div className={tableStyles.loadingOverlay}>
            <div className={tableStyles.spinner} />
            <p>Loading maintenance sheets...</p>
          </div>
        ) : data.length === 0 ? (
          <EmptyState
            title="No worksheets scheduled"
            description="No scheduled servicing records match your filter parameters."
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
                  const isSortable = column.id !== "actions";

                  return (
                    <th key={column.id} className={tableStyles.th}>
                      {isSortable ? (
                        <div
                          className={tableStyles.sortableHeader}
                          onClick={() => handleSortChange(column.id)}
                        >
                          {column.id === "id" ? "W.O. Code" :
                           column.id === "vehicle" ? "Vehicle Unit" :
                           column.id === "type" ? "Service Type" :
                           column.id === "scheduledDate" ? "Scheduled Date" :
                           column.id === "estimatedCompletion" ? "Est Completion" :
                           column.id}
                          {getSortIcon(column.id)}
                        </div>
                      ) : (
                        column.id
                      )}
                    </th>
                  );
                })}
                <th className={`${tableStyles.th} ${styles.actionCell}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => {
                const isOverdue = row.status === "Overdue";
                const rowClass = isOverdue ? styles.overdueRow : "";

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
                          {column.id === "id" ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                              <span
                                onClick={() => onView(row.id)}
                                style={{ fontWeight: 700, color: "var(--primary)", cursor: "pointer" }}
                              >
                                {row.id}
                              </span>
                              {isOverdue && <ShieldAlert size={14} style={{ color: "var(--danger)" }} title="Overdue Worksheet!" />}
                            </div>
                          ) : column.id === "status" ? (
                            <StatusBadge status={row.status} />
                          ) : column.id === "priority" ? (
                            <strong style={{ color: getPriorityColor(row.priority) }}>
                              {row.priority}
                            </strong>
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

                            {(row.status === "Scheduled" || row.status === "In Progress" || row.status === "Overdue") && (
                              <button
                                type="button"
                                className={tableStyles.pageButton}
                                style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1rem", border: "none", width: "100%", background: "none", textAlign: "left", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}
                                onClick={() => { onEdit(row.id); setActiveMenuId(null); }}
                              >
                                <Edit2 size={14} /> Edit Worksheet
                              </button>
                            )}

                            {(row.status === "Scheduled" || row.status === "Overdue") && (
                              <button
                                type="button"
                                className={tableStyles.pageButton}
                                style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1rem", border: "none", width: "100%", background: "none", textAlign: "left", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", color: "var(--primary)" }}
                                onClick={() => { onStart(row.id); setActiveMenuId(null); }}
                              >
                                <Wrench size={14} /> Start Service
                              </button>
                            )}

                            {row.status === "In Progress" && (
                              <button
                                type="button"
                                className={tableStyles.pageButton}
                                style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1rem", border: "none", width: "100%", background: "none", textAlign: "left", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", color: "var(--success)" }}
                                onClick={() => { onComplete(row.id); setActiveMenuId(null); }}
                              >
                                <CheckCircle2 size={14} /> Complete Service
                              </button>
                            )}

                            {(row.status === "Scheduled" || row.status === "In Progress" || row.status === "Overdue") && (
                              <button
                                type="button"
                                className={tableStyles.pageButton}
                                style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1rem", border: "none", width: "100%", background: "none", textAlign: "left", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", color: "var(--warning)" }}
                                onClick={() => { onCancel(row.id); setActiveMenuId(null); }}
                              >
                                <AlertOctagon size={14} /> Cancel Service
                              </button>
                            )}

                            <button
                              type="button"
                              className={tableStyles.pageButton}
                              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1rem", border: "none", width: "100%", background: "none", textAlign: "left", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", color: "var(--danger)" }}
                              onClick={() => { onDelete(row.id); setActiveMenuId(null); }}
                            >
                              <Trash2 size={14} /> Delete Worksheet
                            </button>

                            <div style={{ height: "1px", backgroundColor: "var(--border-color)", margin: "0.25rem 0" }} />

                            <button
                              type="button"
                              className={tableStyles.pageButton}
                              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1rem", border: "none", width: "100%", background: "none", textAlign: "left", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-muted)" }}
                              onClick={() => { onView(row.id); setActiveMenuId(null); }}
                            >
                              <Activity size={14} /> View Timeline
                            </button>

                            <button
                              type="button"
                              className={tableStyles.pageButton}
                              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1rem", border: "none", width: "100%", background: "none", textAlign: "left", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-muted)" }}
                              onClick={() => { navigate(`/vehicles?id=${row.plateNumber}`); setActiveMenuId(null); }}
                            >
                              <Truck size={14} /> View Vehicle
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

      {/* Pagination Footer */}
      {!isLoading && data.length > 0 && (
        <div className={tableStyles.pagination}>
          <div className={tableStyles.pageInfo}>
            Showing {pagination.pageIndex * pagination.pageSize + 1} to {Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalCount)} of {totalCount} worksheets
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

export default MaintenanceTable;
