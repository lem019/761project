import React, { useState } from 'react';
import { Menu, Layout as AntLayout, theme } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  PlusOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  CheckSquareOutlined,
  EyeOutlined,
  FileDoneOutlined
} from '@ant-design/icons';
import useUserStore from "@/domain/user/store/user.store";
import styles from './menu.module.less';


const MenuTop = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useUserStore((state) => state.user);
  const userRole = user?.role || user?.userRole;

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const adminMenuItems = [
    { 
      key: 'inspection', 
      label: 'Inspection',
      icon: <SearchOutlined />,
      children: [
        {
          key: 'create-form',
          label: 'Create Form',
          icon: <PlusOutlined />,
          path: '/create-form'
        },
        {
          key: 'in-progress',
          label: 'In Progress',
          icon: <ClockCircleOutlined />,
          path: '/in-progress'
        },
        {
          key: 'approved',
          label: 'Approved',
          icon: <CheckSquareOutlined />,
          path: '/approved'
        },
      ]
    },
    { 
      key: 'review-center', 
      label: 'Review Center',
      icon: <EyeOutlined />,
      children: [
        {
          key: 'to-review',
          label: 'To Review',
          icon: <FileTextOutlined />,
          path: '/to-review'
        },
        {
          key: 'reviewed',
          label: 'Reviewed',
          icon: <FileDoneOutlined />,
          path: '/reviewed'
        }
      ]
    },
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

  
  const menuItems = userRole === 'employee' ?  employeeMenuItems : adminMenuItems;

  const handleMenuClick = ({ key }) => {
    const menuItem = menuItems.find(item => item.key === key);
    if (menuItem?.path) {
      navigate(menuItem.path);
    }
  };

  return (

      <div className={styles['top-menu-container']}>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          onClick={handleMenuClick}
          className={styles.menu}
          items={menuItems}
        />
      </div>
  );
};

export default MenuTop;
