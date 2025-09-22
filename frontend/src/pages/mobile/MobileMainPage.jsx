import React from "react";
import MobileHeader from "@/components/mobile/MobileHeader";
import { Outlet } from "react-router-dom";

const tabs = ["Create", "In Progress", "Approved"];

const MobileMainPage = ({ children }) => (
  <>
    <MobileHeader tabs={tabs} />
    <div style={{ padding: "16px 0", position: "relative" }}>
      {children || <Outlet />}  {/* 支持 children 或 Outlet */}
    </div>
  </>
);

export default MobileMainPage;