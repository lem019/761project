import React from 'react';
import { Breadcrumb } from 'antd';
import { useLocation } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import styles from './breadcrumb.module.less';

const AppBreadcrumb = () => {
  const location = useLocation();
  
  const getBreadcrumbItems = () => {
    const pathname = location.pathname;
    
    // 根据路径生成面包屑
    const breadcrumbMap = {
      '/create-form': [
        { title: <HomeOutlined />, href: '/' },
        { title: 'Create Form' }
      ],
      '/pending-approval': [
        { title: <HomeOutlined />, href: '/' },
        { title: 'Pending approval' }
      ],
      '/approved': [
        { title: <HomeOutlined />, href: '/' },
        { title: 'Approved' }
      ],
      '/rejected': [
        { title: <HomeOutlined />, href: '/' },
        { title: 'Rejected' }
      ],
      '/form-list': [
        { title: <HomeOutlined />, href: '/' },
        { title: 'Form List' }
      ]
    };
    
    return breadcrumbMap[pathname] || [
      { title: <HomeOutlined />, href: '/' },
      { title: 'Home' }
    ];
  };

  return (
    <Breadcrumb 
      className={styles.breadcrumb}
      items={getBreadcrumbItems()}
    />
  );
};

export default AppBreadcrumb;
