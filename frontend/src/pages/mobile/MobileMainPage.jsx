import React from "react";
import MobileHeader from "@/components/mobile/MobileHeader";
import { Outlet } from "react-router-dom";

const tabs = ["Create", "In Progress", "Approved"];

const MobileMainPage = ({ children }) => (
  <>
    <MobileHeader tabs={tabs} />
    <div style={{ padding: "16px 0", position: "relative", display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%' }}>
        {children || <Outlet />}  {/* 支持 children 或 Outlet */}
      </div>
    </div>
  </>
);

export default MobileMainPage;