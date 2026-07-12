import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useVehicles from "../hooks/useVehicles";
import ConfirmationDialog from "../components/ConfirmationDialog/ConfirmationDialog";
import {
  VehicleHeader,
  VehicleSummaryCards,
  VehicleSearch,
  VehicleFilters,
  VehicleTable,
  VehicleModal,
  VehicleDetails
} from "../components/Vehicles";

export const Vehicles = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const vehicleIdParam = searchParams.get("id");
  const actionParam = searchParams.get("action");

  const {
    vehicles,
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
    addVehicle,
    editVehicle,
    deleteVehicle,
    retireVehicle,
    duplicateVehicle,
    bulkDelete,
    bulkExport,
    refresh
  } = useVehicles();

  // Modals & Popups States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [retireConfirmId, setRetireConfirmId] = useState(null);

  // Monitor quick-action redirect params from Dashboard (e.g. ?action=create)
  useEffect(() => {
    if (actionParam === "create") {
      setEditingVehicle(null);
      setIsModalOpen(true);
    }
  }, [actionParam]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVehicle(null);
    if (searchParams.get("action") === "create") {
      setSearchParams({}); // Clear query parameter
    }
  };

  const handleOpenAddModal = () => {
    setEditingVehicle(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (id) => {
    const target = vehicles.find((v) => v.id === id);
    setEditingVehicle(target);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    if (editingVehicle) {
      await editVehicle(editingVehicle.id, data);
    } else {
      await addVehicle(data);
    }
    handleCloseModal();
  };

  // View Details Redirect (sets query ID)
  const handleViewDetails = (id) => {
    setSearchParams({ id });
  };

  const handleBackToRegistry = () => {
    setSearchParams({});
    refresh();
  };

  return (
    <div className="fade-in">
      {vehicleIdParam ? (
        // Detailed Spec/ROI/Timeline Sheet
        <VehicleDetails vehicleId={vehicleIdParam} onBack={handleBackToRegistry} />
      ) : (
        // Main Registry Grid
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Header */}
          <VehicleHeader
            totalCount={totalCount}
            onAddClick={handleOpenAddModal}
            onRefresh={refresh}
            onExportClick={() => bulkExport("csv")}
          />

          {/* Cards metrics */}
          <VehicleSummaryCards counts={summaryCounts} />

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
            <VehicleSearch
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm("")}
            />
            <VehicleFilters
              filters={filters}
              updateFilter={updateFilter}
              resetFilters={resetFilters}
            />
          </div>

          {/* Registry Table grid */}
          <VehicleTable
            data={vehicles}
            totalCount={totalCount}
            allVisibleIds={allVisibleIds}
            isLoading={isLoading}
            selectedIds={selectedIds}
            toggleSelectRow={toggleSelectRow}
            toggleSelectAll={toggleSelectAll}
            onView={handleViewDetails}
            onEdit={handleOpenEditModal}
            onDelete={setDeleteConfirmId}
            onRetire={setRetireConfirmId}
            onDuplicate={duplicateVehicle}
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

      {/* Modal Dialog Form */}
      <VehicleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        defaultValues={editingVehicle}
        isEdit={!!editingVehicle}
      />

      {/* Deletion confirmation dialog */}
      <ConfirmationDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={async () => {
          await deleteVehicle(deleteConfirmId);
          setDeleteConfirmId(null);
        }}
        title="Delete Vehicle"
        message="Are you sure you want to delete this vehicle from active rosters? This performs a soft-delete and hides it from registry listings."
        confirmLabel="Soft Delete"
        variant="danger"
      />

      {/* Retirement confirmation dialog */}
      <ConfirmationDialog
        isOpen={!!retireConfirmId}
        onClose={() => setRetireConfirmId(null)}
        onConfirm={async () => {
          await retireVehicle(retireConfirmId);
          setRetireConfirmId(null);
        }}
        title="Retire Transport Asset"
        message="Are you sure you want to retire this vehicle? Once retired, editing will be locked out and it will be excluded from trip assignments."
        confirmLabel="Retire Asset"
        variant="warning"
      />
    </div>
  );
};

export default Vehicles;
