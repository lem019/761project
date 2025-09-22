import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import useUserStore from '@/domain/user/store/user.store';

const AuthLoader = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthLoading } = useUserStore();

  useEffect(() => {
    // 等待Firebase认证状态初始化完成
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 给Firebase一些时间来初始化

    return () => clearTimeout(timer);
  }, []);

  // 如果用户状态还在加载中，显示加载动画
  if (isLoading || isAuthLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <Spin size="large" />
        <div>正在验证身份...</div>
      </div>
    );
  }

  return children;
};

export default AuthLoader;
