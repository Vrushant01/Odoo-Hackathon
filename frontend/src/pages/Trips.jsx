import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useTrips from "../hooks/useTrips";
import ConfirmationDialog from "../components/ConfirmationDialog/ConfirmationDialog";
import Modal from "../components/Modal/Modal";
import {
  TripHeader,
  TripSummaryCards,
  TripSearch,
  TripFilters,
  TripTable,
  TripForm,
  TripDetails,
  DispatchTripModal,
  CompleteTripModal,
  CancelTripModal
} from "../components/Trips";

export const Trips = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tripIdParam = searchParams.get("id");
  const actionParam = searchParams.get("action");
  
  // Dashboard shortcuts filter hooks (e.g. ?driver=Marcus or ?vehicle=TX-9082)
  const driverParam = searchParams.get("driver");
  const vehicleParam = searchParams.get("vehicle");

  const {
    trips,
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
    addTrip,
    editTrip,
    deleteTrip,
    dispatchTrip: apiDispatchTrip,
    completeTrip: apiCompleteTrip,
    cancelTrip: apiCancelTrip,
    duplicateTrip,
    bulkDelete,
    bulkExport,
    refresh
  } = useTrips();

  // Modals States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Lifecycle Modals States
  const [dispatchTripTarget, setDispatchTripTarget] = useState(null);
  const [completeTripTarget, setCompleteTripTarget] = useState(null);
  const [cancelTripTarget, setCancelTripTarget] = useState(null);

  // Monitor URL Params for actions/filters
  useEffect(() => {
    if (actionParam === "create") {
      setEditingTrip(null);
      setIsFormModalOpen(true);
    }
  }, [actionParam]);

  useEffect(() => {
    if (driverParam) {
      updateFilter("driver", driverParam);
    }
    if (vehicleParam) {
      updateFilter("vehicle", vehicleParam);
    }
  }, [driverParam, vehicleParam, updateFilter]);

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingTrip(null);
    if (searchParams.get("action") === "create") {
      setSearchParams({});
    }
  };

  const handleOpenCreateModal = () => {
    setEditingTrip(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (id) => {
    const target = trips.find((t) => t.id === id);
    setEditingTrip(target);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    if (editingTrip) {
      await editTrip(editingTrip.id, data);
    } else {
      await addTrip(data);
    }
    handleCloseFormModal();
  };

  const handleConfirmDispatch = async (dispatchDetails) => {
    if (dispatchTripTarget) {
      await apiDispatchTrip(dispatchTripTarget.id, dispatchDetails);
      setDispatchTripTarget(null);
    }
  };

  const handleConfirmCompletion = async (completionDetails) => {
    if (completeTripTarget) {
      await apiCompleteTrip(completeTripTarget.id, completionDetails);
      setCompleteTripTarget(null);
    }
  };

  const handleConfirmCancellation = async (cancellationDetails) => {
    if (cancelTripTarget) {
      await apiCancelTrip(cancelTripTarget.id, cancellationDetails);
      setCancelTripTarget(null);
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
      {tripIdParam ? (
        // Detailed spec panels
        <TripDetails tripId={tripIdParam} onBack={handleBackToLedger} />
      ) : (
        // Main ledger list
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Header */}
          <TripHeader
            totalCount={totalCount}
            onCreateClick={handleOpenCreateModal}
            onRefresh={refresh}
            onExportClick={() => bulkExport("csv")}
          />

          {/* KPI counters */}
          <TripSummaryCards counts={summaryCounts} />

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
            <TripSearch
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm("")}
            />
            <TripFilters
              filters={filters}
              updateFilter={updateFilter}
              resetFilters={resetFilters}
            />
          </div>

          {/* Table */}
          <TripTable
            data={trips}
            totalCount={totalCount}
            allVisibleIds={allVisibleIds}
            isLoading={isLoading}
            selectedIds={selectedIds}
            toggleSelectRow={toggleSelectRow}
            toggleSelectAll={toggleSelectAll}
            onView={handleViewDetails}
            onEdit={handleOpenEditModal}
            onDelete={setDeleteConfirmId}
            onDispatch={(id) => setDispatchTripTarget(trips.find(t => t.id === id))}
            onComplete={(id) => setCompleteTripTarget(trips.find(t => t.id === id))}
            onCancel={(id) => setCancelTripTarget(trips.find(t => t.id === id))}
            onDuplicate={duplicateTrip}
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

      {/* Trip Form Create/Edit Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        title={editingTrip ? "Edit Trip Details" : "Create Trip Order"}
        size="md"
      >
        <TripForm
          defaultValues={editingTrip}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseFormModal}
          isEdit={!!editingTrip}
        />
      </Modal>

      {/* Dispatch Trip Confirmation Overlay */}
      <DispatchTripModal
        isOpen={!!dispatchTripTarget}
        onClose={() => setDispatchTripTarget(null)}
        onConfirm={handleConfirmDispatch}
        trip={dispatchTripTarget}
      />

      {/* Complete Trip Form Overlay */}
      <CompleteTripModal
        isOpen={!!completeTripTarget}
        onClose={() => setCompleteTripTarget(null)}
        onConfirm={handleConfirmCompletion}
        trip={completeTripTarget}
      />

      {/* Cancel Trip Confirmation Overlay */}
      <CancelTripModal
        isOpen={!!cancelTripTarget}
        onClose={() => setCancelTripTarget(null)}
        onConfirm={handleConfirmCancellation}
        trip={cancelTripTarget}
      />

      {/* Deletion Dialog */}
      <ConfirmationDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={async () => {
          await deleteTrip(deleteConfirmId);
          setDeleteConfirmId(null);
        }}
        title="Delete Trip Record"
        message="Are you sure you want to delete this trip order? This performs a soft-delete and hides it from the dispatches ledger."
        confirmLabel="Soft Delete"
        variant="danger"
      />
    </div>
  );
};

export default Trips;
