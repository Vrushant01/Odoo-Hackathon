import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useMaintenance from "../hooks/useMaintenance";
import ConfirmationDialog from "../components/ConfirmationDialog/ConfirmationDialog";
import Modal from "../components/Modal/Modal";
import {
  MaintenanceHeader,
  MaintenanceSummaryCards,
  MaintenanceSearch,
  MaintenanceFilters,
  MaintenanceTable,
  MaintenanceForm,
  MaintenanceDetails,
  UpcomingMaintenance,
  OverdueMaintenance,
  CompleteMaintenanceModal,
  CancelMaintenanceModal
} from "../components/Maintenance";

export const Maintenance = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const recordIdParam = searchParams.get("id");
  const actionParam = searchParams.get("action");

  // Dashboard shortcut filters (e.g., ?vehicle=CA-4521)
  const vehicleParam = searchParams.get("vehicle");

  const {
    records,
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
    addMaintenance,
    editMaintenance,
    deleteMaintenance,
    startMaintenance,
    completeMaintenance: apiCompleteMaintenance,
    cancelMaintenance: apiCancelMaintenance,
    bulkDelete,
    bulkExport,
    refresh
  } = useMaintenance();

  // Modals States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Lifecycle Modals States
  const [completeTarget, setCompleteTarget] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);

  // Monitor URL Params for actions/filters
  useEffect(() => {
    if (actionParam === "create") {
      setEditingRecord(null);
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
    setEditingRecord(null);
    if (searchParams.get("action") === "create") {
      setSearchParams({});
    }
  };

  const handleOpenCreateModal = () => {
    setEditingRecord(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (id) => {
    const target = records.find((r) => r.id === id);
    setEditingRecord(target);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    if (editingRecord) {
      await editMaintenance(editingRecord.id, data);
    } else {
      await addMaintenance(data);
    }
    handleCloseFormModal();
  };

  const handleConfirmStart = async (id) => {
    await startMaintenance(id);
  };

  const handleConfirmCompletion = async (completionDetails) => {
    if (completeTarget) {
      await apiCompleteMaintenance(completeTarget.id, completionDetails);
      setCompleteTarget(null);
    }
  };

  const handleConfirmCancellation = async (cancellationDetails) => {
    if (cancelTarget) {
      await apiCancelMaintenance(cancelTarget.id, cancellationDetails);
      setCancelTarget(null);
    }
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
      {recordIdParam ? (
        // Detailed spec view
        <MaintenanceDetails recordId={recordIdParam} onBack={handleBackToLedger} />
      ) : (
        // Main ledger list
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Header */}
          <MaintenanceHeader
            totalCount={totalCount}
            onCreateClick={handleOpenCreateModal}
            onRefresh={refresh}
            onExportClick={() => bulkExport("csv")}
          />

          {/* KPI counters */}
          <MaintenanceSummaryCards counts={summaryCounts} />

          {/* Grid Layout: Main ledger vs alerts sidebar */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "2.8fr 1.2fr",
            gap: "1.5rem",
            alignItems: "start"
          }}>
            {/* Left Ledger Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap",
                width: "100%"
              }}>
                <MaintenanceSearch
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClear={() => setSearchTerm("")}
                />
                <MaintenanceFilters
                  filters={filters}
                  updateFilter={updateFilter}
                  resetFilters={resetFilters}
                />
              </div>

              <MaintenanceTable
                data={records}
                totalCount={totalCount}
                allVisibleIds={allVisibleIds}
                isLoading={isLoading}
                selectedIds={selectedIds}
                toggleSelectRow={toggleSelectRow}
                toggleSelectAll={toggleSelectAll}
                onView={handleViewDetails}
                onEdit={handleOpenEditModal}
                onDelete={setDeleteConfirmId}
                onStart={handleConfirmStart}
                onComplete={(id) => setCompleteTarget(records.find(r => r.id === id))}
                onCancel={(id) => setCancelTarget(records.find(r => r.id === id))}
                bulkDelete={bulkDelete}
                bulkExport={bulkExport}
                sorting={sorting}
                setSorting={setSorting}
                pagination={pagination}
                setPagination={setPagination}
                pageCount={pageCount}
              />
            </div>

            {/* Right Alerts Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <OverdueMaintenance records={records} />
              <UpcomingMaintenance records={records} />
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Form Create/Edit Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        title={editingRecord ? "Edit Maintenance Details" : "Schedule Maintenance"}
        size="md"
      >
        <MaintenanceForm
          defaultValues={editingRecord}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseFormModal}
          isEdit={!!editingRecord}
        />
      </Modal>

      {/* Complete Maintenance Dialog */}
      <CompleteMaintenanceModal
        isOpen={!!completeTarget}
        onClose={() => setCompleteTarget(null)}
        onConfirm={handleConfirmCompletion}
        record={completeTarget}
      />

      {/* Cancel Maintenance Dialog */}
      <CancelMaintenanceModal
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleConfirmCancellation}
        record={cancelTarget}
      />

      {/* Deletion Dialog */}
      <ConfirmationDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={async () => {
          await deleteMaintenance(deleteConfirmId);
          setDeleteConfirmId(null);
        }}
        title="Delete Servicing Record"
        message="Are you sure you want to delete this maintenance worksheet? This will soft-delete and hide it from the active ledger."
        confirmLabel="Soft Delete"
        variant="danger"
      />
    </div>
  );
};

export default Maintenance;
