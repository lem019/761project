import React from "react";
import { Navigate } from "react-router-dom";
import { userStore } from "@/domain/user/store/user.store";
import { decodeToken } from "@/utils/helper";

/**
 * 私有路由组件，用于权限校验
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 * @param {string} [props.requiredRole] - 需要的角色权限（可选）
 * @returns {React.ReactNode} - 渲染的组件或重定向
 */
const PrivateRoute = ({ children, requiredRole }) => {
  const user = userStore((state) => state.user);
  
  // 检查是否有token
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // 如果没有用户信息，尝试从token解析
  if (!user && token) {
    const decodedToken = decodeToken(token);
    if (decodedToken) {
      // 将解析的用户信息存储到store中
      userStore.getState().setUser(decodedToken);
    } else {
      // token无效，清除并重定向到登录页
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }
  }
  
  // 如果需要特定角色权限
  if (requiredRole) {
    const currentUser = user || decodeToken(token);
    const userRole = currentUser?.role || currentUser?.userRole;
    
    if (!userRole) {
      return <Navigate to="/login" replace />;
    }
    
    // 角色权限检查
    if (requiredRole === "admin" && userRole !== "admin") {
      // 非admin用户尝试访问admin页面，重定向到首页或显示403
      return <Navigate to="/" replace />;
    }
    
    if (requiredRole === "primary" && !["primary", "admin"].includes(userRole)) {
      // 非primary用户尝试访问primary页面，重定向到首页
      return <Navigate to="/" replace />;
    }
  }
  
  return children;
};

export default PrivateRoute;