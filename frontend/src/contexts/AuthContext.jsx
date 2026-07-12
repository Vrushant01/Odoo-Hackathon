import React, { createContext, useState, useEffect, useContext } from "react";
import { authService } from "../services/authService";
import { ROLE_PERMISSIONS } from "../constants/permissions";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage or sessionStorage on load
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("transitops_token") || sessionStorage.getItem("transitops_token");
      if (storedToken) {
        try {
          const profile = await authService.getProfile(storedToken);
          setToken(storedToken);
          setUser(profile);
        } catch (error) {
          console.error("Failed to restore session:", error);
          // Token expired or invalid
          localStorage.removeItem("transitops_token");
          sessionStorage.removeItem("transitops_token");
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password, role, rememberMe) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password, role);
      const { user: loggedInUser, token: authToken } = response;

      setUser(loggedInUser);
      setToken(authToken);

      if (rememberMe) {
        localStorage.setItem("transitops_token", authToken);
      } else {
        sessionStorage.setItem("transitops_token", authToken);
      }
      return loggedInUser;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (e) {
      console.error("Logout service error:", e);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("transitops_token");
      sessionStorage.removeItem("transitops_token");
      setLoading(false);
    }
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    // Fleet Manager has '*' permission implicitly in config or through direct check
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    return userPermissions.includes(permission) || userPermissions.includes("*");
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    hasPermission
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
