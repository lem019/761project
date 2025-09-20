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
          key: 'create',
          label: 'Create',
          icon: <PlusOutlined />,
          path: '/pc/create'
        },
        {
          key: 'inprogress',
          label: 'In Progress',
          icon: <ClockCircleOutlined />,
          path: '/pc/inprogress'
        },
        {
          key: 'approved',
          label: 'Approved',
          icon: <CheckSquareOutlined />,
          path: '/pc/approved'
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
          path: '/pc/to-review'
        },
        {
          key: 'reviewed',
          label: 'Reviewed',
          icon: <FileDoneOutlined />,
          path: '/pc/reviewed'
        }
      ]
    },
  ];

  const employeeMenuItems = [
    {
      key: '/pc/create',
      label: 'Create',
      icon: <PlusOutlined />,
      path: '/pc/create'
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
    console.log('Menu clicked:', key);
    console.log('Current menuItems:', menuItems);
    
    // 查找菜单项，包括嵌套的子菜单
    const findMenuItem = (items, targetKey) => {
      for (const item of items) {
        if (item.key === targetKey) {
          return item;
        }
        if (item.children) {
          const found = findMenuItem(item.children, targetKey);
          if (found) return found;
        }
      }
      return null;
    };

    const menuItem = findMenuItem(menuItems, key);
    console.log('Found menuItem:', menuItem);
    
    if (menuItem?.path) {
      console.log('Navigating to:', menuItem.path);
      navigate(menuItem.path);
    } else {
      console.log('No path found for menu item');
    }
  };

  // 根据当前路径找到对应的菜单项key
  const getSelectedKeys = () => {
    const pathname = location.pathname;
    
    // 查找匹配的菜单项
    const findMatchingKey = (items) => {
      for (const item of items) {
        if (item.path === pathname) {
          return item.key;
        }
        if (item.children) {
          const found = findMatchingKey(item.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findMatchingKey(menuItems) ? [findMatchingKey(menuItems)] : [];
  };

  return (

      <div className={styles['top-menu-container']}>
        <Menu
          mode="horizontal"
          selectedKeys={getSelectedKeys()}
          onClick={handleMenuClick}
          className={styles.menu}
          items={menuItems}
        />
      </div>
  );
};

export default MenuTop;
