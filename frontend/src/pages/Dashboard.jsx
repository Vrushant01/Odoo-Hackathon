import React from "react";
import { RefreshCw, User, Calendar, UserCheck } from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";
import { useAuth } from "../contexts/AuthContext";
import PageHeader from "../components/PageHeader/PageHeader";
import Button from "../components/Button/Button";
import LoadingSkeleton from "../components/LoadingSkeleton/LoadingSkeleton";
import {
  DashboardFilters,
  KPICards,
  FleetStatus,
  DriverStatus,
  TripsWidget,
  ChartsSection,
  RecentTripsTable,
  MaintenanceWidget,
  FuelWidget,
  ExpenseWidget,
  NotificationsWidget,
  QuickActions,
  ExpiringLicensesWidget
} from "../components/Dashboard";

export const Dashboard = () => {
  const { user } = useAuth();
  const {
    isLoading,
    error,
    summary,
    charts,
    trips,
    maintenance,
    fuel,
    expenses,
    notifications,
    filters,
    searchTerm,
    setSearchTerm,
    updateFilter,
    resetFilters,
    refresh
  } = useDashboard();

  // Date formatting utility
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const breadcrumbs = [
    { label: "Home", route: "/dashboard" },
    { label: "Console", route: "/dashboard" }
  ];

  // Refresh spinner rotation styling
  const refreshAction = (
    <Button
      variant="outline"
      onClick={refresh}
      disabled={isLoading}
      startIcon={
        <RefreshCw
          size={16}
          className={isLoading ? "animate-spin-rotation" : ""}
          style={{ animation: isLoading ? "spin 1s linear infinite" : "none" }}
        />
      }
    >
      Refresh Console
    </Button>
  );

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2 style={{ color: "var(--danger)", marginBottom: "1rem" }}>System Error</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>{error}</p>
        <Button variant="primary" onClick={refresh}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Page Header */}
      <PageHeader
        title="Operational Console"
        subtitle={`Live monitoring for TransitOps Logistics`}
        breadcrumbItems={breadcrumbs}
        action={refreshAction}
      />

      {/* Header Info Panel */}
      <div className="glass-panel" style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.75rem 1.5rem",
        borderRadius: "var(--radius-md)",
        marginTop: "-1rem",
        gap: "1rem",
        fontSize: "0.85rem",
        color: "var(--text-secondary)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Calendar size={14} />
          <span>{currentDate}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <User size={14} />
            <span>Operator: <strong>{user?.name || "Transit Guest"}</strong></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <UserCheck size={14} />
            <span>Role: <strong style={{ color: "var(--primary)" }}>{user?.role || "Fleet Manager"}</strong></span>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <DashboardFilters
        filters={filters}
        updateFilter={updateFilter}
        resetFilters={resetFilters}
      />

      {isLoading ? (
        // Loading State Representation
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
            <LoadingSkeleton variant="card" height="120px" />
            <LoadingSkeleton variant="card" height="120px" />
            <LoadingSkeleton variant="card" height="120px" />
            <LoadingSkeleton variant="card" height="120px" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "1.5rem" }}>
            <LoadingSkeleton variant="card" height="300px" />
            <LoadingSkeleton variant="card" height="300px" />
            <LoadingSkeleton variant="card" height="300px" />
          </div>
        </div>
      ) : (
        <>
          {/* KPI Summary statistics cards */}
          <KPICards summary={summary} />

          {/* Primary Operations Row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem"
          }}>
            <TripsWidget trips={trips} />
            <FleetStatus vehicles={summary?.vehicles} />
            <DriverStatus drivers={summary?.drivers} />
          </div>

          {/* Graphical Analytics Charts */}
          <ChartsSection chartsData={charts} />

          {/* Auxiliary Widget Row: Maintenance, Expiring Licenses, Alerts */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.5rem"
          }}>
            <MaintenanceWidget maintenance={maintenance} />
            <ExpiringLicensesWidget expiringDrivers={summary?.expiringDrivers} />
            <NotificationsWidget notifications={notifications} />
          </div>

          {/* Financial Metrics Row: Fuel & Expenses summaries */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
            gap: "1.5rem"
          }}>
            <FuelWidget fuel={fuel} />
            <ExpenseWidget expenses={expenses} />
          </div>

          {/* Operator Action Shortcuts */}
          <QuickActions />

          {/* Full Table Log of operations */}
          <RecentTripsTable trips={trips} isLoading={isLoading} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
