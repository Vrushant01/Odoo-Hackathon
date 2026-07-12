import React, { useState } from "react";
import useReports from "../hooks/useReports";
import Modal from "../components/Modal/Modal";
import LoadingSkeleton from "../components/LoadingSkeleton/LoadingSkeleton";
import {
  ReportsHeader,
  GlobalFilters,
  ReportsSummaryCards,
  FleetAnalytics,
  DriverAnalytics,
  TripAnalytics,
  MaintenanceAnalytics,
  FuelAnalytics,
  ExpenseAnalytics,
  ProfitabilityAnalytics,
  InsightsPanel,
  ReportGenerator,
  ExportPanel,
  ReportHistory,
  ScheduledReports
} from "../components/Reports";
import {
  LayoutDashboard, Truck, Users, Route, Wrench,
  Fuel, DollarSign, TrendingUp, FileText
} from "lucide-react";

const TABS = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard size={15} /> },
  { id: "fleet", label: "Fleet", icon: <Truck size={15} /> },
  { id: "drivers", label: "Drivers", icon: <Users size={15} /> },
  { id: "trips", label: "Trips", icon: <Route size={15} /> },
  { id: "maintenance", label: "Maintenance", icon: <Wrench size={15} /> },
  { id: "fuel", label: "Fuel", icon: <Fuel size={15} /> },
  { id: "expenses", label: "Expenses", icon: <DollarSign size={15} /> },
  { id: "profitability", label: "Profitability", icon: <TrendingUp size={15} /> },
  { id: "reports", label: "Reports", icon: <FileText size={15} /> }
];

export const Reports = () => {
  const {
    isLoading,
    lastUpdated,
    fleetReport,
    driverReport,
    tripReport,
    maintenanceReport,
    fuelReport,
    expenseReport,
    profitabilityReport,
    insights,
    reportHistory,
    scheduledReports,
    summaryCards,
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters,
    generateReport,
    isGenerating,
    deleteHistoryReport,
    toggleSchedule,
    exportReport,
    refresh
  } = useReports();

  const [activeTab, setActiveTab] = useState("overview");
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <LoadingSkeleton variant="title" width="350px" height="40px" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "1rem" }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <LoadingSkeleton key={i} variant="card" height="80px" />
          ))}
        </div>
        <LoadingSkeleton variant="rect" height="50px" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <LoadingSkeleton variant="card" height="300px" />
          <LoadingSkeleton variant="card" height="300px" />
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <ReportsSummaryCards data={summaryCards} />
            <InsightsPanel insights={insights} />
            <ExportPanel onExport={exportReport} />
          </div>
        );
      case "fleet":
        return <FleetAnalytics data={fleetReport} onExport={exportReport} />;
      case "drivers":
        return <DriverAnalytics data={driverReport} onExport={exportReport} />;
      case "trips":
        return <TripAnalytics data={tripReport} />;
      case "maintenance":
        return <MaintenanceAnalytics data={maintenanceReport} onExport={exportReport} />;
      case "fuel":
        return <FuelAnalytics data={fuelReport} onExport={exportReport} />;
      case "expenses":
        return <ExpenseAnalytics data={expenseReport} onExport={exportReport} />;
      case "profitability":
        return <ProfitabilityAnalytics data={profitabilityReport} onExport={exportReport} />;
      case "reports":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <ReportHistory reports={reportHistory} onDelete={deleteHistoryReport} />
            <ScheduledReports schedules={scheduledReports} onToggle={toggleSchedule} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <ReportsHeader
        lastUpdated={lastUpdated}
        onGenerate={() => setIsGeneratorOpen(true)}
        onExport={() => exportReport("pdf", "operational")}
        onRefresh={refresh}
      />

      {/* Global Filters */}
      <GlobalFilters
        filters={filters}
        updateFilter={updateFilter}
        resetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Tab Navigation */}
      <div
        className="glass-panel"
        style={{
          display: "flex",
          padding: "0.25rem",
          borderRadius: "var(--radius-md)",
          gap: "0.25rem",
          overflowX: "auto",
          width: "100%",
          marginBottom: "1.5rem"
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.625rem 1rem",
              border: "none",
              background: activeTab === tab.id ? "var(--primary)" : "transparent",
              color: activeTab === tab.id ? "var(--text-inverse)" : "var(--text-secondary)",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.85rem",
              transition: "all var(--transition-fast)",
              whiteSpace: "nowrap"
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="fade-in" key={activeTab}>
        {renderTabContent()}
      </div>

      {/* Report Generator Modal */}
      <Modal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        title="Generate Report"
        size="lg"
      >
        <ReportGenerator
          onGenerate={generateReport}
          isGenerating={isGenerating}
          onClose={() => setIsGeneratorOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Reports;
