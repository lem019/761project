// import React from "react";
// import { Navigate } from "react-router-dom";
// import useUserStore from "@/domain/user/store/user.store";
// import { decodeToken } from "@/utils/helper";

// /**
//  * Private route component for access control
//  * Supports both SSO (Firebase) and traditional JWT authentication
//  * @param {Object} props - Component props
//  * @param {React.ReactNode} props.children - Child component
//  * @param {string} [props.requiredRole] - Required role (optional)
//  * @returns {React.ReactNode} - Rendered component or redirect
//  */
// const PrivateRoute = ({ children, requiredRole }) => {
//   const { user, setUser } = useUserStore();
  
//   // Check for both authentication methods
//   const token = localStorage.getItem("token");
//   const isFirebaseUser = user && user.uid; // Firebase user has uid property
  
//   // If no user authenticated via either method, redirect to login
//   if (!user && !token) {
//     return <Navigate to="/login" replace />;
//   }
  
//   // If we have a token but no Firebase user, try to decode the token
//   if (!isFirebaseUser && token) {
//     const decodedToken = decodeToken(token);
//     if (decodedToken) {
//       // Store decoded user info in the state store
//       setUser(decodedToken);
//     } else {
//       // Invalid token: clear and redirect to login
//       localStorage.removeItem("token");
//       return <Navigate to="/login" replace />;
//     }
//   }
  
//   // If a specific role is required
//   if (requiredRole) {
//     let currentUser = user;
//     let userRole;
    
//     if (isFirebaseUser) {
//       // Firebase user - check custom claims or default to basic user
//       userRole = user?.role ?? "primary"
//     } else {
//       // JWT token user
//       currentUser = user || decodeToken(token);
//       userRole = currentUser?.role ?? "primary";
//     }
    
//     if (!userRole) {
//       return <Navigate to="/login" replace />;
//     }
    
//     // Role permission check
//     if (requiredRole === "admin" && userRole !== "admin") {
//       // Non-admin accessing admin page: redirect to home or show 403
//       return <Navigate to="/" replace />;
//     }
    
//     if (requiredRole === "primary" && !["primary", "admin"].includes(userRole)) {
//       // Non-primary accessing primary page: redirect to home
//       return <Navigate to="/" replace />;
//     }
//   }
  
//   return children;
// };

// export default PrivateRoute;


import React, { useEffect, useState } from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import useUserStore from "@/domain/user/store/user.store";
import { userRepo } from "@/domain/user/repository/user.repository";

/**
 * 受保护路由：
 * - 使用 localStorage.idToken 判断是否登录
 * - 若 store 没用户但有 idToken，调用 /auth/me 补齐用户与角色
 * - 限制 requiredRole: "admin" | "primary"
 * - 支持两种用法：包裹子路由（Outlet）或包裹元素（children）
 */
const PrivateRoute = ({ requiredRole, children }) => {
  const location = useLocation();
  const { user, setUser } = useUserStore();
  const [checking, setChecking] = useState(true);

  const idToken =
    (typeof window !== "undefined" && localStorage.getItem("idToken")) || null;

  useEffect(() => {
    let cancelled = false;
    const hydrate = async () => {
      try {
        if (!user && idToken) {
          const me = await userRepo.me(); // { uid, email, role, ... }
          if (!cancelled && me) setUser(me);
        }
      } catch {
        // token 失效
        localStorage.removeItem("idToken");
      } finally {
        if (!cancelled) setChecking(false);
      }
    };
    if (!user && !idToken) {
      setChecking(false);
      return;
    }
    hydrate();
    return () => { cancelled = true; };
  }, [user, idToken, setUser]);

  if (checking) return null; // 可换成全局 Loading
  if (!user && !idToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const role = user?.role || "primary";
  if (requiredRole === "admin" && role !== "admin") {
    return <Navigate to="/employee/create" replace />;
  }
  if (requiredRole === "primary" && role !== "primary") {
    return <Navigate to="/admin/toreview" replace />;
  }

  // 兼容两种写法：有 children 就渲染 children；否则用 <Outlet/>
  return children || <Outlet />;
};

export default PrivateRoute;
