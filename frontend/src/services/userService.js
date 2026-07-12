import api from "./api";

export const userService = {
  getUsers: async (params) => {
    return await api.get("/users", { params });
  },

  getStats: async () => {
    return await api.get("/users/stats");
  },

  getAuditLogs: async (params) => {
    return await api.get("/users/audit-logs", { params });
  },

  createUser: async (userData) => {
    return await api.post("/users", userData);
  },

  updateUser: async (id, userData) => {
    return await api.put(`/users/${id}`, userData);
  },

  deleteUser: async (id) => {
    return await api.delete(`/users/${id}`);
  },

  toggleStatus: async (id, status) => {
    return await api.patch(`/users/${id}/status`, { status });
  },

  lockUser: async (id, reason) => {
    return await api.patch(`/users/${id}/lock`, { reason });
  },

  unlockUser: async (id, reason) => {
    return await api.patch(`/users/${id}/unlock`, { reason });
  },

  resetAttempts: async (id) => {
    return await api.patch(`/users/${id}/reset-attempts`);
  },

  resetPassword: async (id, newPassword) => {
    return await api.post(`/users/${id}/reset-password`, { newPassword });
  }
};

export default userService;
