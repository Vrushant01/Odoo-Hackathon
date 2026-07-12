import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useDrivers from "../hooks/useDrivers";
import ConfirmationDialog from "../components/ConfirmationDialog/ConfirmationDialog";
import Modal from "../components/Modal/Modal";
import { Input, Select, Textarea, Button } from "../components";
import {
  DriverHeader,
  DriverSummaryCards,
  DriverSearch,
  DriverFilters,
  DriverTable,
  DriverModal,
  DriverDetails
} from "../components/Drivers";

export const Drivers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const driverIdParam = searchParams.get("id");
  const actionParam = searchParams.get("action");

  const {
    drivers,
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
    addDriver,
    editDriver,
    deleteDriver,
    suspendDriver,
    activateDriver,
    bulkDelete,
    bulkExport,
    refresh
  } = useDrivers();

  // Modals & Popups States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  
  // Suspension modal details
  const [suspendingDriverId, setSuspendingDriverId] = useState(null);
  const [suspensionDetails, setSuspensionDetails] = useState({
    reason: "Safety Violations",
    expectedReturn: "",
    notes: ""
  });

  // Monitor quick-action redirect params from Dashboard (e.g. ?action=create)
  useEffect(() => {
    if (actionParam === "create") {
      setEditingDriver(null);
      setIsModalOpen(true);
    }
  }, [actionParam]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDriver(null);
    if (searchParams.get("action") === "create") {
      setSearchParams({});
    }
  };

  const handleOpenRegisterModal = () => {
    setEditingDriver(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (id) => {
    const target = drivers.find((d) => d.id === id);
    setEditingDriver(target);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    if (editingDriver) {
      await editDriver(editingDriver.id, data);
    } else {
      await addDriver(data);
    }
    handleCloseModal();
  };

  const handleOpenSuspendModal = (id) => {
    setSuspendingDriverId(id);
    setSuspensionDetails({
      reason: "Safety Violations",
      expectedReturn: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // default 14 days
      notes: ""
    });
  };

  const handleConfirmSuspension = async () => {
    if (suspendingDriverId) {
      await suspendDriver(suspendingDriverId, suspensionDetails);
      setSuspendingDriverId(null);
    }
  };

  const handleViewDetails = (id) => {
    setSearchParams({ id });
  };

  const handleBackToRoster = () => {
    setSearchParams({});
    refresh();
  };

  const suspensionReasons = [
    { value: "Safety Violations", label: "Safety Violations" },
    { value: "Failed License Verification", label: "Failed License Verification" },
    { value: "DOT Compliance Failure", label: "DOT Compliance Failure" },
    { value: "Accident Investigation", label: "Accident Investigation" },
    { value: "Other", label: "Other Administrative Leave" }
  ];

  return (
    <div className="fade-in">
      {driverIdParam ? (
        // Detailed Profile Sheets
        <DriverDetails driverId={driverIdParam} onBack={handleBackToRoster} />
      ) : (
        // Main Grid list
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Header */}
          <DriverHeader
            totalCount={totalCount}
            onRegisterClick={handleOpenRegisterModal}
            onRefresh={refresh}
            onExportClick={() => bulkExport("csv")}
          />

          {/* KPI counters */}
          <DriverSummaryCards counts={summaryCounts} />

          {/* Search bar and Filters */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
            width: "100%",
            marginBottom: "0.5rem"
          }}>
            <DriverSearch
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm("")}
            />
            <DriverFilters
              filters={filters}
              updateFilter={updateFilter}
              resetFilters={resetFilters}
            />
          </div>

          {/* Roster Table grid */}
          <DriverTable
            data={drivers}
            totalCount={totalCount}
            allVisibleIds={allVisibleIds}
            isLoading={isLoading}
            selectedIds={selectedIds}
            toggleSelectRow={toggleSelectRow}
            toggleSelectAll={toggleSelectAll}
            onView={handleViewDetails}
            onEdit={handleOpenEditModal}
            onDelete={setDeleteConfirmId}
            onSuspend={handleOpenSuspendModal}
            onActivate={activateDriver}
            bulkDelete={bulkDelete}
            bulkExport={bulkExport}
            sorting={sorting}
            setSorting={setSorting}
            pagination={pagination}
            setPagination={setPagination}
            pageCount={pageCount}
          />
        </div>
      )}

      {/* Driver Registration/Editing Form Modal */}
      <DriverModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        defaultValues={editingDriver}
        isEdit={!!editingDriver}
      />

      {/* Suspension Details Capture Overlay Modal */}
      <Modal
        isOpen={!!suspendingDriverId}
        onClose={() => setSuspendingDriverId(null)}
        title="Suspend Operator Credentials"
        size="sm"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
            Specify safety violation reasons and set expected return dates for operator suspension.
          </p>

          <Select
            label="Suspension Reason"
            value={suspensionDetails.reason}
            onChange={(e) => setSuspensionDetails(prev => ({ ...prev, reason: e.target.value }))}
            options={suspensionReasons}
          />

          <Input
            label="Expected Return Date"
            type="date"
            value={suspensionDetails.expectedReturn}
            onChange={(e) => setSuspensionDetails(prev => ({ ...prev, expectedReturn: e.target.value }))}
          />

          <Textarea
            label="Suspension Notes / Audit Details"
            placeholder="Log infraction codes, accident dates, or compliance reports..."
            value={suspensionDetails.notes}
            onChange={(e) => setSuspensionDetails(prev => ({ ...prev, notes: e.target.value }))}
          />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
            <Button variant="secondary" onClick={() => setSuspendingDriverId(null)}>
              Cancel
            </Button>
            <Button variant="warning" onClick={handleConfirmSuspension}>
              Confirm Suspension
            </Button>
          </div>
        </div>
      </Modal>

      {/* Deletion verification */}
      <ConfirmationDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={async () => {
          await deleteDriver(deleteConfirmId);
          setDeleteConfirmId(null);
        }}
        title="Delete Driver Profile"
        message="Are you sure you want to delete this operator? This performs a soft-delete and hides them from active rosters."
        confirmLabel="Soft Delete"
        variant="danger"
      />
    </div>
  );
};

export default Drivers;
