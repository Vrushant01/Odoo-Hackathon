import api from "./api";

export const authService = {
  login: async (email, password, role) => {
    // Send request to backend
    const res = await api.post("/auth/login", { email, password });
    
    // The backend returns the user and token inside res.data
    const authData = res.data;

    // Verify role if required by frontend selection
    if (role && authData.user.role !== role) {
      throw new Error(`Unauthorized role access: expected ${role} but got ${authData.user.role}.`);
    }

    return authData;
  },

  logout: async () => {
    return await api.post("/auth/logout");
  },

  getProfile: async (token) => {
    // Note: The token is automatically attached by the Axios request interceptor.
    const res = await api.get("/auth/me");
    return res.data;
  }
};

export default authService;
