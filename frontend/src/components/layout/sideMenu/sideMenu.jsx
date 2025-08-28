// import React, { useState } from 'react';
// import { Menu, Layout as AntLayout } from 'antd';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { 
//   PlusOutlined, 
//   FileTextOutlined, 
//   CheckCircleOutlined, 
//   CloseCircleOutlined,
//   MenuFoldOutlined,
//   MenuUnfoldOutlined
// } from '@ant-design/icons';
// import useUserStore from "@/domain/user/store/user.store";
// import styles from './sideMenu.module.less';

// const { Sider } = AntLayout;

// const SideMenu = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const user = useUserStore((state) => state.user);
//   const userRole = user?.role || user?.userRole;

//   const adminMenuItems = [
//     { key: '1', label: 'Admin Dashboard' },
//     { key: '2', label: 'User Management' },
//     { key: '3', label: 'Settings' },
//   ];

//   const employeeMenuItems = [
//     { 
//       key: '/create-form', 
//       label: 'Create Form', 
//       icon: <PlusOutlined />,
//       path: '/create-form'
//     },
//     { 
//       key: '/pending-approval', 
//       label: 'Pending approval', 
//       icon: <FileTextOutlined />,
//       path: '/pending-approval'
//     },
//     { 
//       key: '/approved', 
//       label: 'Approved', 
//       icon: <CheckCircleOutlined />,
//       path: '/approved'
//     },
//     { 
//       key: '/rejected', 
//       label: 'Rejected', 
//       icon: <CloseCircleOutlined />,
//       path: '/rejected'
//     },
//   ];

//   const menuItems = userRole === 'admin' ? adminMenuItems : employeeMenuItems;

//   const handleMenuClick = ({ key }) => {
//     const menuItem = menuItems.find(item => item.key === key);
//     if (menuItem?.path) {
//       navigate(menuItem.path);
//     }
//   };

//   return (
//     <Sider 
//       trigger={null} 
//       collapsible 
//       collapsed={collapsed}
//       className={styles.sider}
//     >
      
//       <Menu
//         mode="inline"
//         selectedKeys={[location.pathname]}
//         onClick={handleMenuClick}
//         className={styles.menu}
//         items={menuItems.map(item => ({
//           key: item.key,
//           icon: item.icon,
//           label: item.label,
//         }))}
//       />
      
//       <div className={styles['collapse-button']}>
//         <div onClick={() => setCollapsed(!collapsed)}>
//           {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
//         </div>
//       </div>
//     </Sider>
//   );
// };

// export default SideMenu;

import React, { useMemo } from "react";
import { Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import useUserStore from "@/domain/user/store/user.store";

const SideMenu = () => {
  const { user } = useUserStore();
  const role = user?.role || "primary";
  const location = useLocation();
  const navigate = useNavigate();

  const items = useMemo(() => {
    if (role === "admin") {
      return [
        { key: "/admin/toreview", label: "To review" },
        { key: "/admin/pending", label: "Pending approval" }, // 和 To review 同源列表
        { key: "/admin/approved", label: "Approved" },
        { key: "/admin/rejected", label: "Rejected" },
      ];
    }
    // primary（employee）
    return [
      { key: "/employee/create", label: "Create Form" },
      { key: "/employee/pending", label: "Pending approval" },
      { key: "/employee/approved", label: "Approved" },
      { key: "/employee/rejected", label: "Rejected" },
    ];
  }, [role]);

  // 选中高亮
  const selectedKeys = useMemo(() => {
    const path = location.pathname.toLowerCase();
    const item = items.find(i => path.startsWith(i.key));
    return item ? [item.key] : [];
  }, [location.pathname, items]);

  return (
    <Menu
      mode="inline"
      style={{ height: "100%", borderRight: 0 }}
      items={items}
      selectedKeys={selectedKeys}
      onClick={({ key }) => navigate(key)}
    />
  );
};

export default SideMenu;
