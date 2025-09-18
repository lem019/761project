import React, { useEffect, useState } from 'react';
import { Breadcrumb } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import styles from './breadcrumb.module.less';

const AppBreadcrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  
  // 监听路由变化
  useEffect(() => {
    console.log('Breadcrumb: Route changed to:', location.pathname);
    setCurrentPath(location.pathname);
  }, [location.pathname]);
  
  const getBreadcrumbItems = () => {
    const pathname = currentPath;
    console.log('Breadcrumb: Getting items for path:', pathname);
    
    // 根据路径生成面包屑
    const breadcrumbMap = {
      // Admin Create 页面
      '/admin-create': [
        { 
          title: <HomeOutlined />, 
          onClick: () => navigate('/'),
          style: { cursor: 'pointer' }
        },
        { title: 'Inspection' },
        { title: 'Create' }
      ],
      // Admin In Progress 页面
      '/admin-in-progress': [
        { 
          title: <HomeOutlined />, 
          onClick: () => navigate('/'),
          style: { cursor: 'pointer' }
        },
        { title: 'Inspection' },
        { title: 'In Progress' }
      ],
      // Admin Approved 页面
      '/admin-approved': [
        { 
          title: <HomeOutlined />, 
          onClick: () => navigate('/'),
          style: { cursor: 'pointer' }
        },
        { title: 'Inspection' },
        { title: 'Approved' }
      ],
      // To Review 页面
      '/to-review': [
        { 
          title: <HomeOutlined />, 
          onClick: () => navigate('/'),
          style: { cursor: 'pointer' }
        },
        { title: 'Review Center' },
        { title: 'To Review' }
      ],
      // Reviewed 页面
      '/reviewed': [
        { 
          title: <HomeOutlined />, 
          onClick: () => navigate('/'),
          style: { cursor: 'pointer' }
        },
        { title: 'Review Center' },
        { title: 'Reviewed' }
      ],
      // Review Form 页面
      '/review-form': [
        { 
          title: <HomeOutlined />, 
          onClick: () => navigate('/'),
          style: { cursor: 'pointer' }
        },
        { title: 'Review Form' }
      ],
      // To Review Form 页面
      '/toreview-form': [
        { 
          title: <HomeOutlined />, 
          onClick: () => navigate('/'),
          style: { cursor: 'pointer' }
        },
        { title: 'Create Form' }
      ],
      // Employee 页面
      '/pending-approval': [
        { 
          title: <HomeOutlined />, 
          onClick: () => navigate('/'),
          style: { cursor: 'pointer' }
        },
        { title: 'Pending approval' }
      ],
      '/approved': [
        { 
          title: <HomeOutlined />, 
          onClick: () => navigate('/'),
          style: { cursor: 'pointer' }
        },
        { title: 'Approved' }
      ],
      '/rejected': [
        { 
          title: <HomeOutlined />, 
          onClick: () => navigate('/'),
          style: { cursor: 'pointer' }
        },
        { title: 'Rejected' }
      ],
      '/form-list': [
        { 
          title: <HomeOutlined />, 
          onClick: () => navigate('/'),
          style: { cursor: 'pointer' }
        },
        { title: 'Form List' }
      ]
    };
    
    const items = breadcrumbMap[pathname] || [
      { 
        title: <HomeOutlined />, 
        onClick: () => navigate('/'),
        style: { cursor: 'pointer' }
      },
      { title: 'Home' }
    ];
    
    console.log('Breadcrumb: Generated items:', items);
    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();
  console.log('Breadcrumb: Rendering with items:', breadcrumbItems);

  return (
    <Breadcrumb 
      className={styles.breadcrumb}
      items={breadcrumbItems}
    />
  );
};

export default AppBreadcrumb;
