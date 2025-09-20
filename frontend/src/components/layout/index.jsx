import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout as AntLayout } from 'antd';
import Navibar from '@/components/layout/navibar/navibar';
import AppBreadcrumb from '@/components/layout/breadcrumb/breadcrumb.jsx';
import styles from './index.module.less';

const { Content } = AntLayout;

const Layout = () => {
  return (
    <AntLayout className={styles['layout-container']}>
      <Navibar />
      <AntLayout className={styles['layout-content']}>
        <Content className={styles['content-area']}>
          <AppBreadcrumb />
          <div className={styles['outlet-container']}>
            <Outlet />
          </div>
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
