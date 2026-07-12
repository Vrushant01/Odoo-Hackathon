import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useExpenses from "../hooks/useExpenses";
import ConfirmationDialog from "../components/ConfirmationDialog/ConfirmationDialog";
import Modal from "../components/Modal/Modal";
import {
  ExpenseHeader,
  ExpenseSummaryCards,
  ExpenseSearch,
  ExpenseFilters,
  ExpenseTable,
  ExpenseForm,
  ExpenseDetails,
  ExpenseCharts,
  ExpenseSummary
} from "../components/Expenses";

export const Expenses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const expenseIdParam = searchParams.get("id");
  const actionParam = searchParams.get("action");

  // Dashboard shortcuts
  const vehicleParam = searchParams.get("vehicle");

  const {
    expenses,
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
    addExpense,
    editExpense,
    deleteExpense,
    bulkDelete,
    bulkExport,
    refresh
  } = useExpenses();

  // Modals States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Monitor URL Params
  useEffect(() => {
    if (actionParam === "create") {
      setEditingExpense(null);
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
    setEditingExpense(null);
    if (searchParams.get("action") === "create") {
      setSearchParams({});
    }
  };

  const handleOpenCreateModal = () => {
    setEditingExpense(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (id) => {
    const target = expenses.find((e) => e.id === id);
    setEditingExpense(target);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    if (editingExpense) {
      await editExpense(editingExpense.id, data);
    } else {
      await addExpense(data);
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
      {expenseIdParam ? (
        // Detailed spec view
        <ExpenseDetails expenseId={expenseIdParam} onBack={handleBackToLedger} />
      ) : (
        // Main ledger list view
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Header */}
          <ExpenseHeader
            totalCount={totalCount}
            onCreateClick={handleOpenCreateModal}
            onRefresh={refresh}
            onExportClick={() => bulkExport("csv")}
          />

          {/* KPI counters */}
          <ExpenseSummaryCards counts={summaryCounts} />

          {/* Grid Layout: Main ledger vs operational cost summary */}
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
                <ExpenseSearch
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClear={() => setSearchTerm("")}
                />
                <ExpenseFilters
                  filters={filters}
                  updateFilter={updateFilter}
                  resetFilters={resetFilters}
                />
              </div>

              <ExpenseTable
                data={expenses}
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
            </div>

            {/* Right Cost Summary Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <ExpenseSummary summary={summaryCounts} />
            </div>
          </div>

          {/* Visual Trends Charts */}
          {!isLoading && expenses.length > 0 && (
            <div style={{ marginTop: "1.5rem" }}>
              <ExpenseCharts chartsData={chartsData} />
            </div>
          )}

        </div>
      )}

      {/* Expense Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        title={editingExpense ? "Edit Expense Details" : "Record Expense Invoice"}
        size="md"
      >
        <ExpenseForm
          defaultValues={editingExpense}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseFormModal}
          isEdit={!!editingExpense}
        />
      </Modal>

      {/* Deletion Dialog */}
      <ConfirmationDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={async () => {
          await deleteExpense(deleteConfirmId);
          setDeleteConfirmId(null);
        }}
        title="Delete Expense Record"
        message="Are you sure you want to delete this expense statement? This will soft-delete and hide it from the active ledger."
        confirmLabel="Soft Delete"
        variant="danger"
      />
    </div>
  );
};

export default Expenses;
