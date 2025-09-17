import React, { useState } from "react";
import MobileHeader from "@/components/mobile/MobileHeader";
import ApprovedPage from "@/pages/mobile/mobile-approved/ApprovedPage";

const tabs = ["Create", "In Progress", "Approved"];

const MobileMainPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <MobileHeader tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      {/* {activeTab === 0 && <CreatePage />}
      {activeTab === 1 && <InProgressPage />} */}
      {activeTab === 2 && <ApprovedPage />}
    </>
  );
};

export default MobileMainPage;