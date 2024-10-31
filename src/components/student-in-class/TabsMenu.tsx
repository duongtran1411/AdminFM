import { Tabs } from "antd";
interface TabsMenuProps {
  tabItems: any[];
}
const TabsMenu = ({ tabItems }: TabsMenuProps) => {
  if (!tabItems) {
    tabItems = [
      { label: "All AI Employees", key: "1" },
      { label: "Active", key: "2" },
      { label: "On Hold", key: "3" },
    ];
  }

  return <Tabs defaultActiveKey="1" items={tabItems} />;
};

export default TabsMenu;
