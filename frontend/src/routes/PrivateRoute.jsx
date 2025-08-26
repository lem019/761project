import React from "react";
import { Navigate } from "react-router-dom";
import { userStore } from "@/domain/user/store/user.store";
import { decodeToken } from "@/utils/helper";

/**
 * Private route component for access control
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child component
 * @param {string} [props.requiredRole] - Required role (optional)
 * @returns {React.ReactNode} - Rendered component or redirect
 */
const PrivateRoute = ({ children, requiredRole }) => {
  const user = userStore((state) => state.user);
  
  // Check if token exists
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // If no user info in store, try decoding from token
  if (!user && token) {
    const decodedToken = decodeToken(token);
    if (decodedToken) {
      // Store decoded user info in the state store
      userStore.getState().setUser(decodedToken);
    } else {
      // Invalid token: clear and redirect to login
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }
  }
  
  // If a specific role is required
  if (requiredRole) {
    const currentUser = user || decodeToken(token);
    const userRole = currentUser?.role || currentUser?.userRole;
    
    if (!userRole) {
      return <Navigate to="/login" replace />;
    }
    
    // Role permission check
    if (requiredRole === "admin" && userRole !== "admin") {
      // Non-admin accessing admin page: redirect to home or show 403
      return <Navigate to="/" replace />;
    }
    
    if (requiredRole === "primary" && !["primary", "admin"].includes(userRole)) {
      // Non-primary accessing primary page: redirect to home
      return <Navigate to="/" replace />;
    }
  }
  
  return children;
};

export default PrivateRoute;