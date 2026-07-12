import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  flexRender
} from "@tanstack/react-table";
import {
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  AlertOctagon,
  Copy,
  Route,
  Wrench,
  Fuel,
  ChevronDown,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "../StatusBadge/StatusBadge";
import Button from "../Button/Button";
import EmptyState from "../EmptyState/EmptyState";
import styles from "./VehicleTable.module.css";
import tableStyles from "../Table/Table.module.css";
import ActionMenu from "../ActionMenu/ActionMenu";
import actionMenuStyles from "../ActionMenu/ActionMenu.module.css";

export const VehicleTable = ({
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
  onRetire,
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

  // Formatter utilities
  const formatCost = (val) => `$${Number(val).toLocaleString()}`;
  const formatOdo = (val) => `${Number(val).toLocaleString()} mi`;
  const formatCapacity = (val) => `${Number(val).toLocaleString()} lbs`;

  // Define Columns
  const columns = [
    {
      id: "select",
      header: () => (
        <input
          type="checkbox"
          className={styles.visibilityCheckbox}
          checked={allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedIds.includes(id))}
          onChange={(e) => toggleSelectAll(e.target.checked, allVisibleIds)}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          className={styles.visibilityCheckbox}
          checked={selectedIds.includes(row.original.id)}
          onChange={() => toggleSelectRow(row.original.id)}
        />
      ),
      enableHiding: false
    },
    {
      accessorKey: "plateNumber",
      header: "Reg Number",
      cell: ({ row }) => (
        <span
          onClick={() => onView(row.original.id)}
          style={{ fontWeight: 700, color: "var(--primary)", cursor: "pointer" }}
        >
          {row.getValue("plateNumber")}
        </span>
      )
    },
    {
      accessorKey: "name",
      header: "Vehicle Name"
    },
    {
      accessorKey: "model",
      header: "Model"
    },
    {
      accessorKey: "type",
      header: "Asset Type"
    },
    {
      accessorKey: "loadCapacity",
      header: "Max Load",
      cell: ({ row }) => formatCapacity(row.getValue("loadCapacity"))
    },
    {
      accessorKey: "odometer",
      header: "Odometer",
      cell: ({ row }) => formatOdo(row.getValue("odometer"))
    },
    {
      accessorKey: "cost",
      header: "Acquisition Cost",
      cell: ({ row }) => formatCost(row.getValue("cost"))
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />
    },
    {
      accessorKey: "currentDriver",
      header: "Current Driver",
      cell: ({ row }) => row.getValue("currentDriver") || <span style={{ color: "var(--text-muted)" }}>None</span>
    },
    {
      accessorKey: "currentTrip",
      header: "Current Trip",
      cell: ({ row }) => row.getValue("currentTrip") || <span style={{ color: "var(--text-muted)" }}>None</span>
    },
    {
      accessorKey: "region",
      header: "Region Hub"
    },
    {
      accessorKey: "lastMaintenance",
      header: "Last Maintained"
    },
    {
      accessorKey: "nextMaintenance",
      header: "Next Service"
    }
  ];

  // Column Visibility State management (TanStack Table config)
  const [columnVisibility, setColumnVisibility] = useState({
    select: true,
    plateNumber: true,
    name: true,
    model: true,
    type: true,
    loadCapacity: true,
    odometer: true,
    cost: false, // Default hidden for smaller displays
    status: true,
    currentDriver: true,
    currentTrip: false,
    region: true,
    lastMaintenance: false,
    nextMaintenance: true
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility
    },
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
              <span className={styles.bulkText}>{selectedIds.length} assets selected</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => bulkExport("csv")}
                startIcon={<ExternalLinkIcon size={12} />}
              >
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => bulkExport("pdf")}
                startIcon={<ExternalLinkIconIcon size={12} />}
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
          {/* Column Visibility Control */}
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
                  if (column.id === "select" || column.id === "actions") return null;
                  return (
                    <label key={column.id} className={styles.visibilityItem}>
                      <input
                        type="checkbox"
                        className={styles.visibilityCheckbox}
                        checked={column.getIsVisible()}
                        onChange={column.getToggleVisibilityHandler()}
                      />
                      {column.id === "plateNumber" ? "Reg Number" :
                       column.id === "name" ? "Vehicle Name" :
                       column.id === "loadCapacity" ? "Max Load" :
                       column.id === "currentDriver" ? "Current Driver" :
                       column.id === "currentTrip" ? "Current Trip" :
                       column.id === "lastMaintenance" ? "Last Maintained" :
                       column.id === "nextMaintenance" ? "Next Service" :
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
            <p>Loading vehicle logs...</p>
          </div>
        ) : data.length === 0 ? (
          <EmptyState
            title="No vehicles found"
            description="No transport assets match your current search queries or filters."
          />
        ) : (
          <table className={tableStyles.table}>
            <thead className={tableStyles.thead}>
              <tr>
                {/* Checkbox column */}
                <th className={`${tableStyles.th} ${styles.checkboxCell}`}>
                  <input
                    type="checkbox"
                    className={styles.visibilityCheckbox}
                    checked={isAllSelected}
                    onChange={(e) => toggleSelectAll(e.target.checked, allVisibleIds)}
                  />
                </th>

                {/* Dynamic Columns */}
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
                          {column.id === "plateNumber" ? "Reg Number" :
                           column.id === "name" ? "Vehicle Name" :
                           column.id === "loadCapacity" ? "Max Load" :
                           column.id === "currentDriver" ? "Current Driver" :
                           column.id === "currentTrip" ? "Current Trip" :
                           column.id === "lastMaintenance" ? "Last Maintained" :
                           column.id === "nextMaintenance" ? "Next Service" :
                           column.id}
                          {getSortIcon(column.id)}
                        </div>
                      ) : (
                        column.id
                      )}
                    </th>
                  );
                })}

                {/* Actions column */}
                <th className={`${tableStyles.th} ${styles.actionCell}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className={tableStyles.tr}>
                  {/* Checkbox cell */}
                  <td className={styles.checkboxCell}>
                    <input
                      type="checkbox"
                      className={styles.visibilityCheckbox}
                      checked={selectedIds.includes(row.id)}
                      onChange={() => toggleSelectRow(row.id)}
                    />
                  </td>

                  {/* Dynamic Visible Cells */}
                  {table.getVisibleFlatColumns().map((column) => {
                    if (column.id === "select") return null;
                    const cellVal = row[column.id];

                    return (
                      <td key={column.id} className={tableStyles.td}>
                        {column.id === "plateNumber" ? (
                          <span
                            onClick={() => onView(row.id)}
                            style={{ fontWeight: 700, color: "var(--primary)", cursor: "pointer" }}
                          >
                            {row.plateNumber}
                          </span>
                        ) : column.id === "status" ? (
                          <StatusBadge status={row.status} />
                        ) : column.id === "loadCapacity" ? (
                          formatCapacity(row.loadCapacity)
                        ) : column.id === "odometer" ? (
                          formatOdo(row.odometer)
                        ) : column.id === "cost" ? (
                          formatCost(row.cost)
                        ) : (
                          cellVal || <span style={{ color: "var(--text-muted)" }}>None</span>
                        )}
                      </td>
                    );
                  })}

                  {/* Actions dropdown cell */}
                  <td className={`${tableStyles.td} ${styles.actionCell}`}>
                    <ActionMenu
                      isOpen={activeMenuId === row.id}
                      onOpen={() => setActiveMenuId(row.id)}
                      onClose={() => setActiveMenuId(null)}
                    >
                      <button type="button" className={actionMenuStyles.menuItem} onClick={() => onView(row.id)}>
                        <Eye size={14} /> View Details
                      </button>

                      {row.status !== "Retired" && (
                        <button type="button" className={actionMenuStyles.menuItem} onClick={() => onEdit(row.id)}>
                          <Edit2 size={14} /> Edit Asset
                        </button>
                      )}

                      <button type="button" className={actionMenuStyles.menuItem} onClick={() => onDuplicate(row.id)}>
                        <Copy size={14} /> Duplicate Asset
                      </button>

                      {row.status !== "Retired" && (
                        <button type="button" className={actionMenuStyles.menuItem} style={{ color: "var(--warning)" }} onClick={() => onRetire(row.id)}>
                          <AlertOctagon size={14} /> Retire Asset
                        </button>
                      )}

                      <button type="button" className={actionMenuStyles.menuItem} style={{ color: "var(--danger)" }} onClick={() => onDelete(row.id)}>
                        <Trash2 size={14} /> Delete (Soft)
                      </button>

                      <div className={actionMenuStyles.menuDivider} />

                      <button type="button" className={actionMenuStyles.menuItem} style={{ color: "var(--text-muted)" }} onClick={() => navigate(`/trips?vehicle=${row.plateNumber}`)}>
                        <Route size={14} /> View Trips
                      </button>

                      <button type="button" className={actionMenuStyles.menuItem} style={{ color: "var(--text-muted)" }} onClick={() => navigate(`/maintenance?vehicle=${row.plateNumber}`)}>
                        <Wrench size={14} /> Maintenance Logs
                      </button>

                      <button type="button" className={actionMenuStyles.menuItem} style={{ color: "var(--text-muted)" }} onClick={() => navigate(`/fuel?vehicle=${row.plateNumber}`)}>
                        <Fuel size={14} /> Fuel Logs
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
            Showing {pagination.pageIndex * pagination.pageSize + 1} to {Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalCount)} of {totalCount} assets
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

// Internal icons helper to avoid import errors
const ExternalLinkIcon = ({ size }) => <span style={{ display: "inline-flex", transform: "scale(0.85)" }}>📄</span>;
const ExternalLinkIconIcon = ({ size }) => <span style={{ display: "inline-flex", transform: "scale(0.85)" }}>📁</span>;

export default VehicleTable;
