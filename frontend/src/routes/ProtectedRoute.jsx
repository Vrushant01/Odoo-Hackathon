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
    return (
      <MainLayout>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
          padding: "2rem"
        }}>
          <h2 style={{ fontSize: "2rem", color: "var(--danger)", marginBottom: "1rem" }}>Access Denied</h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: "450px", marginBottom: "1.5rem" }}>
            You do not have the required permissions to access this page. Please contact your administrator if you believe this is an error.
          </p>
        </div>
      </MainLayout>
    );
  }

  // If authenticated and permitted, render in MainLayout
  return <MainLayout>{children}</MainLayout>;
};

export default ProtectedRoute;
