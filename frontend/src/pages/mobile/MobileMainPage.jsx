import React from "react";
import MobileHeader from "@/components/mobile/MobileHeader";
import { Outlet } from "react-router-dom";

const tabs = ["Create", "In Progress", "Approved"];

const MobileMainPage = () => (
  <>
    <MobileHeader tabs={tabs} />
    <div style={{ padding: "16px 0" }}>
      <Outlet />
    </div>
  </>
);

export default MobileMainPage;