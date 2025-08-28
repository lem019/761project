import React, { useState } from 'react';
import { Menu, Layout as AntLayout } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  PlusOutlined, 
  FileTextOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import useUserStore from "@/domain/user/store/user.store";
import styles from './sideMenu.module.less';

const { Sider } = AntLayout;

const SideMenu = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useUserStore((state) => state.user);
  const userRole = user?.role || user?.userRole;

  const adminMenuItems = [
    { key: '1', label: 'Admin Dashboard' },
    { key: '2', label: 'User Management' },
    { key: '3', label: 'Settings' },
  ];

  const employeeMenuItems = [
    { 
      key: '/create-form', 
      label: 'Create Form', 
      icon: <PlusOutlined />,
      path: '/create-form'
    },
    { 
      key: '/pending-approval', 
      label: 'Pending approval', 
      icon: <FileTextOutlined />,
      path: '/pending-approval'
    },
    { 
      key: '/approved', 
      label: 'Approved', 
      icon: <CheckCircleOutlined />,
      path: '/approved'
    },
    { 
      key: '/rejected', 
      label: 'Rejected', 
      icon: <CloseCircleOutlined />,
      path: '/rejected'
    },
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : employeeMenuItems;

  const handleMenuClick = ({ key }) => {
    const menuItem = menuItems.find(item => item.key === key);
    if (menuItem?.path) {
      navigate(menuItem.path);
    }
  };

  return (
    <Sider 
      trigger={null} 
      collapsible 
      collapsed={collapsed}
      className={styles.sider}
    >
      
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        onClick={handleMenuClick}
        className={styles.menu}
        items={menuItems.map(item => ({
          key: item.key,
          icon: item.icon,
          label: item.label,
        }))}
      />
      
      <div className={styles['collapse-button']}>
        <div onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      </div>
    </Sider>
  );
};

export default SideMenu;