import React, { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../Button/Button";
import EmptyState from "../EmptyState/EmptyState";

export const AnalyticsTable = ({
  title,
  subtitle,
  columns = [],
  data = [],
  isLoading = false,
  pageSize = 5,
  showSearch = true,
  showExport = true,
  onExport
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(0);

  // Search
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lower = searchTerm.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const val = row[col.key];
        return val != null && String(val).toLowerCase().includes(lower);
      })
    );
  }, [data, searchTerm, columns]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortOrder === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredData, sortField, sortOrder]);

  // Paginate
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = currentPage * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown size={11} style={{ opacity: 0.35 }} />;
    return sortOrder === "asc" ? <ArrowUp size={11} /> : <ArrowDown size={11} />;
  };

  return (
    <div className="glass-panel" style={{
      borderRadius: "var(--radius-md)",
      border: "1px solid var(--border-color)",
      overflow: "hidden"
    }}>
      {/* Header */}
      <div style={{
        padding: "1rem 1.25rem",
        borderBottom: "1px solid var(--border-color)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "0.75rem"
      }}>
        <div>
          <h4 style={{ fontSize: "1rem", fontWeight: 700, fontFamily: "var(--font-accent)", margin: 0 }}>{title}</h4>
          {subtitle && <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.125rem" }}>{subtitle}</p>}
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {showSearch && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              padding: "0.375rem 0.75rem",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--bg-primary)"
            }}>
              <Search size={13} style={{ color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "0.8rem",
                  color: "var(--text-primary)",
                  width: "120px"
                }}
              />
            </div>
          )}
          {showExport && (
            <Button variant="outline" size="sm" onClick={onExport} startIcon={<Download size={12} />}>
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        {isLoading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
            <div className="spinner" style={{ margin: "0 auto 1rem" }} />
            Loading analytics data...
          </div>
        ) : paginatedData.length === 0 ? (
          <EmptyState title="No data available" description="No records match the current filters." />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    style={{
                      padding: "0.75rem 1rem",
                      textAlign: "left",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      borderBottom: "1px solid var(--border-color)",
                      cursor: "pointer",
                      userSelect: "none",
                      whiteSpace: "nowrap"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                      {col.label}
                      {getSortIcon(col.key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: "1px solid var(--border-color)",
                    transition: "background var(--transition-fast)"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        padding: "0.75rem 1rem",
                        fontSize: "0.85rem",
                        color: "var(--text-primary)",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {col.render ? col.render(row[col.key], row) : (
                        col.format === "currency" ? `$${Number(row[col.key]).toLocaleString()}` :
                        col.format === "number" ? Number(row[col.key]).toLocaleString() :
                        col.format === "percent" ? `${row[col.key]}%` :
                        row[col.key] ?? "—"
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && sortedData.length > pageSize && (
        <div style={{
          padding: "0.75rem 1.25rem",
          borderTop: "1px solid var(--border-color)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.8rem",
          color: "var(--text-muted)"
        }}>
          <span>
            {currentPage * pageSize + 1}–{Math.min((currentPage + 1) * pageSize, sortedData.length)} of {sortedData.length}
          </span>
          <div style={{ display: "flex", gap: "0.375rem" }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              style={{
                display: "flex", alignItems: "center", padding: "0.375rem",
                border: "1px solid var(--border-color)", borderRadius: "var(--radius-xs)",
                background: "var(--bg-secondary)", cursor: currentPage === 0 ? "not-allowed" : "pointer",
                color: "var(--text-secondary)", opacity: currentPage === 0 ? 0.4 : 1
              }}
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                style={{
                  padding: "0.375rem 0.625rem",
                  border: "1px solid var(--border-color)", borderRadius: "var(--radius-xs)",
                  background: currentPage === i ? "var(--primary)" : "var(--bg-secondary)",
                  color: currentPage === i ? "var(--text-inverse)" : "var(--text-secondary)",
                  fontWeight: 700, fontSize: "0.75rem", cursor: "pointer"
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
              style={{
                display: "flex", alignItems: "center", padding: "0.375rem",
                border: "1px solid var(--border-color)", borderRadius: "var(--radius-xs)",
                background: "var(--bg-secondary)", cursor: currentPage >= totalPages - 1 ? "not-allowed" : "pointer",
                color: "var(--text-secondary)", opacity: currentPage >= totalPages - 1 ? 0.4 : 1
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsTable;
