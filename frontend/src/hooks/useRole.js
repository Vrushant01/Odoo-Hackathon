import useAuth from "./useAuth";

export const useRole = () => {
  const { user, hasPermission } = useAuth();
  
  return {
    role: user?.role || null,
    permissions: user?.permissions || [],
    hasPermission,
    isManager: user?.role === "Fleet Manager",
    isDispatcher: user?.role === "Dispatcher",
    isSafetyOfficer: user?.role === "Safety Officer",
    isFinancialAnalyst: user?.role === "Financial Analyst"
  };
};

export default useRole;
