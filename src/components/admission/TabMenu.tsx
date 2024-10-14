import { Tabs } from "antd";
import React from "react";

interface AdmissionTabsMenuProps {
  onTabChange: (key: string) => void;
}

const AdmissionTabsMenu: React.FC<AdmissionTabsMenuProps> = ({ onTabChange }) => {
  const tabItems = [
    { label: "Tuyển Sinh", key: "1" },
    { label: "Xét Tuyển", key: "2" },
  ];

  return (
    <Tabs defaultActiveKey="1" onChange={onTabChange} items={tabItems} />
  );
};

export default AdmissionTabsMenu;
