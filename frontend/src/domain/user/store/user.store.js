import { create } from "zustand";

/**
 * 用户状态管理store
 */
export const userStore = create((set, get) => ({
  user: null,
  
  /**
   * 设置用户信息
   * @param {Object} user - 用户信息对象
   */
  setUser: (user) => set({ user }),
  
  /**
   * 获取用户角色
   * @returns {string|null} - 用户角色
   */
  getUserRole: () => {
    const user = get().user;
    return user?.role || user?.userRole || null;
  },
  
  /**
   * 检查用户是否有指定角色权限
   * @param {string} requiredRole - 需要的角色
   * @returns {boolean} - 是否有权限
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
   * 清除用户信息
   */
  clearUser: () => set({ user: null }),
}));