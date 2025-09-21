import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useUserStore from '@/domain/user/store/user.store';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAuthLoading } = useUserStore();
  const location = useLocation();

  // 如果正在加载认证状态，显示加载中
  if (isAuthLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // 如果用户未登录，重定向到登录页
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 如果需要管理员权限但用户不是管理员
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
