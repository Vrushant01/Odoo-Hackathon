import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import {
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  Compass,
  CheckCircle2,
  AlertOctagon,
  Copy,
  Route,
  Activity,
  DollarSign,
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
import styles from "./TripTable.module.css";
import tableStyles from "../Table/Table.module.css";
import ActionMenu from "../ActionMenu/ActionMenu";

export const TripTable = ({
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
  onDispatch,
  onComplete,
  onCancel,
  onDuplicate,
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

  const formatDistance = (val) => `${Number(val).toLocaleString()} mi`;
  const formatWeight = (val) => `${Number(val).toLocaleString()} lbs`;
  const formatDuration = (val) => `${Number(val).toFixed(1)} hrs`;

  // Define Columns
  const columns = [
    { id: "select", enableHiding: false },
    { accessorKey: "id", header: "Trip ID" },
    { accessorKey: "vehicle", header: "Vehicle Assigned" },
    { accessorKey: "driver", header: "Driver" },
    { accessorKey: "source", header: "Origin" },
    { accessorKey: "destination", header: "Destination" },
    { accessorKey: "cargoWeight", header: "Cargo Weight" },
    { accessorKey: "plannedDistance", header: "Distance" },
    { accessorKey: "expectedDuration", header: "Est Duration" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "createdDate", header: "Created Date" }
  ];

  // Visibility state
  const [columnVisibility, setColumnVisibility] = useState({
    select: true,
    id: true,
    vehicle: true,
    driver: true,
    source: true,
    destination: true,
    cargoWeight: true,
    plannedDistance: true,
    expectedDuration: false,
    status: true,
    createdDate: false
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
              <span className={styles.bulkText}>{selectedIds.length} trips selected</span>
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
                      {column.id === "id" ? "Trip ID" :
                       column.id === "vehicle" ? "Vehicle Assigned" :
                       column.id === "cargoWeight" ? "Cargo Weight" :
                       column.id === "plannedDistance" ? "Distance" :
                       column.id === "expectedDuration" ? "Est Duration" :
                       column.id === "createdDate" ? "Created Date" :
                       column.id}
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table grid */}
      <div className={tableStyles.tableWrapper}>
        {isLoading ? (
          <div className={tableStyles.loadingOverlay}>
            <div className={tableStyles.spinner} />
            <p>Loading trips ledgers...</p>
          </div>
        ) : data.length === 0 ? (
          <EmptyState
            title="No trips scheduled"
            description="No scheduled transport dispatches match your filter variables."
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
                          {column.id === "id" ? "Trip ID" :
                           column.id === "vehicle" ? "Vehicle Assigned" :
                           column.id === "cargoWeight" ? "Cargo Weight" :
                           column.id === "plannedDistance" ? "Distance" :
                           column.id === "expectedDuration" ? "Est Duration" :
                           column.id === "createdDate" ? "Created Date" :
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
              {data.map((row) => (
                <tr key={row.id} className={tableStyles.tr}>
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
                          <span
                            onClick={() => onView(row.id)}
                            style={{ fontWeight: 700, color: "var(--primary)", cursor: "pointer" }}
                          >
                            {row.id}
                          </span>
                        ) : column.id === "status" ? (
                          <StatusBadge status={row.status} />
                        ) : column.id === "cargoWeight" ? (
                          formatWeight(row.cargoWeight)
                        ) : column.id === "plannedDistance" ? (
                          formatDistance(row.plannedDistance)
                        ) : column.id === "expectedDuration" ? (
                          formatDuration(row.expectedDuration)
                        ) : (
                          row[column.id] || <span style={{ color: "var(--text-muted)" }}>None</span>
                        )}
                      </td>
                    );
                  })}

                  {/* Actions Dropdown */}
                  <td className={`${tableStyles.td} ${styles.actionCell}`}>
                    <ActionMenu
                      isOpen={activeMenuId === row.id}
                      onOpen={() => setActiveMenuId(row.id)}
                      onClose={() => setActiveMenuId(null)}
                    >
                      <button
                        type="button"
                        className={tableStyles.pageButton}
                        style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1rem", border: "none", width: "100%", background: "none", textAlign: "left", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}
                        onClick={() => onView(row.id)}
                      >
                        <Eye size={14} /> View Details
                      </button>

                      {(row.status === "Draft" || row.status === "Dispatched") && (
                        <button
                          type="button"
                          className={tableStyles.pageButton}
                          style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1rem", border: "none", width: "100%", background: "none", textAlign: "left", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}
                          onClick={() => onEdit(row.id)}
                        >
                          <Edit2 size={14} /> Edit Dispatch
                        </button>
                      )}

                      {row.status === "Draft" && (
                        <button
                          type="button"
                          className={tableStyles.pageButton}
                          style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1rem", border: "none", width: "100%", background: "none", textAlign: "left", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", color: "var(--primary)" }}
                          onClick={() => onDispatch(row.id)}
                        >
                          <Compass size={14} /> Dispatch Trip
                        </button>
                      )}

                      {row.status === "Dispatched" && (
                        <button
                          type="button"
                          className={tableStyles.pageButton}
                          style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1rem", border: "none", width: "100%", background: "none", textAlign: "left", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", color: "var(--success)" }}
                          onClick={() => onComplete(row.id)}
                        >
                          <CheckCircle2 size={14} /> Complete Trip
                        </button>
                      )}

                      {(row.status === "Draft" || row.status === "Dispatched") && (
                        <button
                          type="button"
                          className={tableStyles.pageButton}
                          style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1rem", border: "none", width: "100%", background: "none", textAlign: "left", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", color: "var(--warning)" }}
                          onClick={() => onCancel(row.id)}
                        >
                          <AlertOctagon size={14} /> Cancel Trip
                        </button>
                      )}

                      <button
                        type="button"
                        className={tableStyles.pageButton}
                        style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1rem", border: "none", width: "100%", background: "none", textAlign: "left", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}
                        onClick={() => onDuplicate(row.id)}
                      >
                        <Copy size={14} /> Duplicate Trip
                      </button>

                      <button
                        type="button"
                        className={tableStyles.pageButton}
                        style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1rem", border: "none", width: "100%", background: "none", textAlign: "left", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", color: "var(--danger)" }}
                        onClick={() => onDelete(row.id)}
                      >
                        <Trash2 size={14} /> Delete (Soft)
                      </button>

                      <div style={{ height: "1px", backgroundColor: "var(--border-color)", margin: "0.25rem 0" }} />

                      <button
                        type="button"
                        className={tableStyles.pageButton}
                        style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1rem", border: "none", width: "100%", background: "none", textAlign: "left", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-muted)" }}
                        onClick={() => onView(row.id)}
                      >
                        <Activity size={14} /> View Timeline
                      </button>
                    </ActionMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {!isLoading && data.length > 0 && (
        <div className={tableStyles.pagination}>
          <div className={tableStyles.pageInfo}>
            Showing {pagination.pageIndex * pagination.pageSize + 1} to {Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalCount)} of {totalCount} dispatches
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

export default TripTable;
