import { MOCK_USERS } from "../mock-data/auth";
import { mockResponse } from "./apiHelper";

export const authService = {
  login: async (email, password, role) => {
    // Look for matching user
    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.role === role
    );

    if (!user) {
      throw new Error("Invalid credentials or role selection.");
    }

    if (user.password !== password) {
      throw new Error("Incorrect password.");
    }

    // Mock successful authentication response
    const authData = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        permissions: user.permissions
      },
      token: `mock-jwt-token-for-${user.id}-${Date.now()}`
    };

    return mockResponse(authData, 500);
  },

  logout: async () => {
    return mockResponse({ success: true }, 200);
  },

  getProfile: async (token) => {
    if (!token || !token.startsWith("mock-jwt-token")) {
      throw new Error("Unauthorized");
    }

    const userId = token.split("-")[4]; // Extract user-1, user-2, etc.
    const user = MOCK_USERS.find((u) => u.id === `user-${userId}`);

    if (!user) {
      throw new Error("User profile not found");
    }

    return mockResponse({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      permissions: user.permissions
    }, 300);
  }
};
