import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useFuel from "../hooks/useFuel";
import ConfirmationDialog from "../components/ConfirmationDialog/ConfirmationDialog";
import Modal from "../components/Modal/Modal";
import {
  FuelHeader,
  FuelSummaryCards,
  FuelSearch,
  FuelFilters,
  FuelTable,
  FuelForm,
  FuelDetails,
  FuelCharts
} from "../components/Fuel";

export const Fuel = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const logIdParam = searchParams.get("id");
  const actionParam = searchParams.get("action");

  // Dashboard shortcuts
  const vehicleParam = searchParams.get("vehicle");

  const {
    logs,
    totalCount,
    allVisibleIds,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    resetFilters,
    sorting,
    setSorting,
    pagination,
    setPagination,
    pageCount,
    selectedIds,
    toggleSelectRow,
    toggleSelectAll,
    summaryCounts,
    chartsData,
    addFuelLog,
    editFuelLog,
    deleteFuelLog,
    bulkDelete,
    bulkExport,
    refresh
  } = useFuel();

  // Modals States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Monitor URL Params
  useEffect(() => {
    if (actionParam === "create") {
      setEditingLog(null);
      setIsFormModalOpen(true);
    }
  }, [actionParam]);

  useEffect(() => {
    if (vehicleParam) {
      updateFilter("vehicle", vehicleParam);
    }
  }, [vehicleParam, updateFilter]);

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingLog(null);
    if (searchParams.get("action") === "create") {
      setSearchParams({});
    }
  };

  const handleOpenCreateModal = () => {
    setEditingLog(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (id) => {
    const target = logs.find((l) => l.id === id);
    setEditingLog(target);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    if (editingLog) {
      await editFuelLog(editingLog.id, data);
    } else {
      await addFuelLog(data);
    }
    handleCloseFormModal();
  };

  const handleViewDetails = (id) => {
    setSearchParams({ id });
  };

  const handleBackToLedger = () => {
    setSearchParams({});
    refresh();
  };

  return (
    <div className="fade-in">
      {logIdParam ? (
        // Detailed spec view
        <FuelDetails logId={logIdParam} onBack={handleBackToLedger} />
      ) : (
        // Main ledger list view
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Header */}
          <FuelHeader
            totalCount={totalCount}
            onCreateClick={handleOpenCreateModal}
            onRefresh={refresh}
            onExportClick={() => bulkExport("csv")}
          />

          {/* KPI counters */}
          <FuelSummaryCards counts={summaryCounts} />

          {/* Search, Filters, and Table Grid */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
            width: "100%",
            marginBottom: "0.5rem"
          }}>
            <FuelSearch
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm("")}
            />
            <FuelFilters
              filters={filters}
              updateFilter={updateFilter}
              resetFilters={resetFilters}
            />
          </div>

          <FuelTable
            data={logs}
            totalCount={totalCount}
            allVisibleIds={allVisibleIds}
            isLoading={isLoading}
            selectedIds={selectedIds}
            toggleSelectRow={toggleSelectRow}
            toggleSelectAll={toggleSelectAll}
            onView={handleViewDetails}
            onEdit={handleOpenEditModal}
            onDelete={setDeleteConfirmId}
            bulkDelete={bulkDelete}
            bulkExport={bulkExport}
            sorting={sorting}
            setSorting={setSorting}
            pagination={pagination}
            setPagination={setPagination}
            pageCount={pageCount}
          />

          {/* Visual Trends Charts */}
          {!isLoading && logs.length > 0 && (
            <div style={{ marginTop: "1.5rem" }}>
              <FuelCharts chartsData={chartsData} />
            </div>
          )}

        </div>
      )}

      {/* Fuel Log Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        title={editingLog ? "Edit Refueling Log" : "Log Refueling Invoice"}
        size="md"
      >
        <FuelForm
          defaultValues={editingLog}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseFormModal}
          isEdit={!!editingLog}
        />
      </Modal>

      {/* Deletion Dialog */}
      <ConfirmationDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={async () => {
          await deleteFuelLog(deleteConfirmId);
          setDeleteConfirmId(null);
        }}
        title="Delete Refueling Log"
        message="Are you sure you want to delete this refueling invoice log? This will soft-delete and hide it from the active ledger."
        confirmLabel="Soft Delete"
        variant="danger"
      />
    </div>
  );
};

export default Fuel;
