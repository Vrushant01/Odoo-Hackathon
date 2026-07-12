import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import MainLayout from "../layouts/MainLayout";
import LoadingSkeleton from "../components/LoadingSkeleton";

export const ProtectedRoute = ({ children, permission }) => {
  const { isAuthenticated, loading, hasPermission } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "var(--bg-primary)" }}>
        <LoadingSkeleton variant="card" width="400px" height="200px" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page and save the state location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If page-level permission check is required
  if (permission && !hasPermission(permission)) {
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and permitted, render in MainLayout
  return <MainLayout>{children}</MainLayout>;
};

export default ProtectedRoute;
