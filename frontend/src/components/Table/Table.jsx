import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import SearchBar from "../SearchBar/SearchBar";
import EmptyState from "../EmptyState/EmptyState";
import styles from "./Table.module.css";

export const Table = ({
  columns = [],
  data = [],
  isLoading = false,
  searchPlaceholder = "Search records...",
  showSearch = true,
  filterComponent,
  emptyTitle,
  emptyDescription,
  emptyIcon
}) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5
      }
    }
  });

  const { getPageCount, previousPage, nextPage, getCanPreviousPage, getCanNextPage, setPageIndex } = table;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = table.getFilteredRowModel().rows.length;

  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  const getSortIcon = (column) => {
    if (!column.getCanSort()) return null;
    const sorted = column.getIsSorted();
    if (sorted === "asc") return <ArrowUp size={14} />;
    if (sorted === "desc") return <ArrowDown size={14} />;
    return <ArrowUpDown size={14} style={{ opacity: 0.5 }} />;
  };

  return (
    <div className={styles.tableContainer}>
      {/* Toolbar for Search & Filters */}
      {(showSearch || filterComponent) && (
        <div className={styles.toolbar}>
          {showSearch && (
            <div className={styles.searchWrapper}>
              <SearchBar
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                onClear={() => setGlobalFilter("")}
                placeholder={searchPlaceholder}
              />
            </div>
          )}
          {filterComponent && (
            <div className={styles.filterWrapper}>
              {filterComponent}
            </div>
          )}
        </div>
      )}

      {/* Main Table Content */}
      <div className={styles.tableWrapper}>
        {isLoading ? (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner} />
            <p>Loading records...</p>
          </div>
        ) : totalRows === 0 ? (
          <EmptyState
            title={emptyTitle || "No records found"}
            description={emptyDescription}
            icon={emptyIcon}
          />
        ) : (
          <table className={styles.table}>
            <thead className={styles.thead}>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className={styles.th}>
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <div
                          className={styles.sortableHeader}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {getSortIcon(header.column)}
                        </div>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className={styles.tr}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={styles.td}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {!isLoading && totalRows > 0 && (
        <div className={styles.pagination}>
          <div className={styles.pageInfo}>
            Showing {startRow} to {endRow} of {totalRows} records
          </div>

          <div className={styles.paginationActions}>
            <button
              className={styles.pageButton}
              onClick={() => setPageIndex(0)}
              disabled={!getCanPreviousPage()}
              aria-label="First page"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              className={styles.pageButton}
              onClick={() => previousPage()}
              disabled={!getCanPreviousPage()}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Page number indicators */}
            {Array.from({ length: getPageCount() }, (_, i) => i)
              .filter(i => Math.abs(i - pageIndex) <= 1 || i === 0 || i === getPageCount() - 1)
              .map((pageIdx, idx, arr) => {
                const prev = arr[idx - 1];
                const showEllipsis = prev !== undefined && pageIdx - prev > 1;

                return (
                  <React.Fragment key={pageIdx}>
                    {showEllipsis && <span style={{ color: "var(--text-muted)", padding: "0 0.25rem" }}>...</span>}
                    <button
                      className={`${styles.pageButton} ${
                        pageIndex === pageIdx ? styles.activePageButton : ""
                      }`}
                      onClick={() => setPageIndex(pageIdx)}
                    >
                      {pageIdx + 1}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              className={styles.pageButton}
              onClick={() => nextPage()}
              disabled={!getCanNextPage()}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
            <button
              className={styles.pageButton}
              onClick={() => setPageIndex(getPageCount() - 1)}
              disabled={!getCanNextPage()}
              aria-label="Last page"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
