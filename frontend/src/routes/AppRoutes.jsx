import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { PERMISSIONS } from "../constants/permissions";

// Import pages
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard";
import Vehicles from "../pages/Vehicles";
import Drivers from "../pages/Drivers";
import Trips from "../pages/Trips";
import Maintenance from "../pages/Maintenance";
import Fuel from "../pages/Fuel";
import Expenses from "../pages/Expenses";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import LockedAccount from "../pages/Login/LockedAccount";
import UserManagement from "../pages/UserManagement";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Operations Pages */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute permission={PERMISSIONS.DASHBOARD_VIEW}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vehicles"
        element={
          <ProtectedRoute permission={PERMISSIONS.VEHICLES_VIEW}>
            <Vehicles />
          </ProtectedRoute>
        }
      />
      <Route
        path="/drivers"
        element={
          <ProtectedRoute permission={PERMISSIONS.DRIVERS_VIEW}>
            <Drivers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips"
        element={
          <ProtectedRoute permission={PERMISSIONS.TRIPS_VIEW}>
            <Trips />
          </ProtectedRoute>
        }
      />
      <Route
        path="/maintenance"
        element={
          <ProtectedRoute permission={PERMISSIONS.MAINTENANCE_VIEW}>
            <Maintenance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/fuel"
        element={
          <ProtectedRoute permission={PERMISSIONS.FUEL_VIEW}>
            <Fuel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses"
        element={
          <ProtectedRoute permission={PERMISSIONS.FUEL_VIEW}>
            <Expenses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute permission={PERMISSIONS.REPORTS_VIEW}>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute permission={PERMISSIONS.SETTINGS_VIEW}>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute permission={PERMISSIONS.USERS_VIEW}>
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route path="/locked" element={<LockedAccount />} />

      {/* Fallback routing */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
