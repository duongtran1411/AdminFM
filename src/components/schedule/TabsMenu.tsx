import { Tabs } from "antd";
import React from "react";

interface ScheduleTabsMenuProps {
  onTabChange: (key: string) => void;
}

const ScheduleTabsMenu: React.FC<ScheduleTabsMenuProps> = ({ onTabChange }) => {
  const tabItems = [
    { label: "Schedule", key: "1" },
    { label: "Students", key: "2" },
    { label: "Grades", key: "3" },
  ];

  return <Tabs defaultActiveKey="1" onChange={onTabChange} items={tabItems} />;
};

export default ScheduleTabsMenu;
