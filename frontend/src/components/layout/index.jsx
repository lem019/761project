// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import { Layout as AntLayout } from 'antd';
// import SideMenu from '@/components/layout/sideMenu/sideMenu';
// import Navibar from '@/components/layout/navibar/navibar';
// import AppBreadcrumb from '@/components/layout/breadcrumb/breadcrumb.jsx';
// import styles from './index.module.less';

// const { Content } = AntLayout;

// const Layout = () => {
//   return (
//     <AntLayout className={styles['layout-container']}>
//         <Navibar />
//       <AntLayout>
//       <SideMenu />
//         <Content className={styles['content-area']}>
//           <AppBreadcrumb />
//           <div className={styles['outlet-container']}>
//             <Outlet />
//           </div>
//         </Content>
//       </AntLayout>
//     </AntLayout>
//   );
// };

// export default Layout;


// src/components/layout/index.jsx
import React from "react";
import { Layout as AntLayout } from "antd";
import { Outlet } from "react-router-dom";
// 注意：这里指向目录里的 index.jsx（推荐写全，避免大小写/解析问题）
import SideMenu from "./sideMenu/sideMenu.jsx";

const { Sider, Content, Header } = AntLayout;

const Layout = () => {
  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Sider width={220} style={{ background: "#fff" }}>
        <div
          style={{
            height: 56,
            display: "flex",
            alignItems: "center",
            paddingLeft: 16,
            fontWeight: 600,
          }}
        >
          thermoFLO
        </div>
        <SideMenu />
      </Sider>

      <AntLayout>
        <Header
          style={{ background: "#fff", borderBottom: "1px solid #f0f0f0" }}
        />
        <Content
          style={{
            margin: 16,
            background: "#fff",
            padding: 16,
            borderRadius: 8,
          }}
        >
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
