import { Tabs } from "antd";
import React from "react";

interface ApplicationTabsMenuProps {
  onTabChange: (key: string) => void;
}

const ApplicationTabsMenu: React.FC<ApplicationTabsMenuProps> = ({
  onTabChange,
}) => {
  const tabItems = [
    { label: "Thông tin người bảo hộ", key: "1" },
    { label: "Lý lịch học sinh", key: "2" },
  ];

  return <Tabs defaultActiveKey="1" onChange={onTabChange} items={tabItems} />;
};

export default ApplicationTabsMenu;
