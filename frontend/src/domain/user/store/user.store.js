import { create } from "zustand";

/**
 * User state management store
 */
export const userStore = create((set, get) => ({
  user: null,
  
  /**
   * Set user info
   * @param {Object} user - User object
   */
  setUser: (user) => set({ user }),
  
  /**
   * Get user role
   * @returns {string|null} - User role
   */
  getUserRole: () => {
    const user = get().user;
    return user?.role || user?.userRole || null;
  },
  
  /**
   * Check if user has required role
   * @param {string} requiredRole - Required role
   * @returns {boolean} - Whether user has permission
   */
  hasRole: (requiredRole) => {
    const userRole = get().getUserRole();
    if (!userRole) return false;
    
    if (requiredRole === "admin") {
      return userRole === "admin";
    }
    
    if (requiredRole === "primary") {
      return ["primary", "admin"].includes(userRole);
    }
    
    return false;
  },
  
  /**
   * Clear user info
   */
  clearUser: () => set({ user: null }),
}));