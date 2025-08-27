import React from "react";
import { Navigate } from "react-router-dom";
import useUserStore from "@/domain/user/store/user.store";
import { decodeToken } from "@/utils/helper";

/**
 * Private route component for access control
 * Supports both SSO (Firebase) and traditional JWT authentication
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child component
 * @param {string} [props.requiredRole] - Required role (optional)
 * @returns {React.ReactNode} - Rendered component or redirect
 */
const PrivateRoute = ({ children, requiredRole }) => {
  const { user, setUser } = useUserStore();
  
  // Check for both authentication methods
  const token = localStorage.getItem("token");
  const isFirebaseUser = user && user.uid; // Firebase user has uid property
  
  // If no user authenticated via either method, redirect to login
  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }
  
  // If we have a token but no Firebase user, try to decode the token
  if (!isFirebaseUser && token) {
    const decodedToken = decodeToken(token);
    if (decodedToken) {
      // Store decoded user info in the state store
      setUser(decodedToken);
    } else {
      // Invalid token: clear and redirect to login
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }
  }
  
  // If a specific role is required
  if (requiredRole) {
    let currentUser = user;
    let userRole;
    
    if (isFirebaseUser) {
      // Firebase user - check custom claims or default to basic user
      userRole = user?.role ?? "primary"
    } else {
      // JWT token user
      currentUser = user || decodeToken(token);
      userRole = currentUser?.role ?? "primary";
    }
    
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