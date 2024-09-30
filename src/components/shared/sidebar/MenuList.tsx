import { HomeOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import { FaChalkboardTeacher, FaRegUser } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
import { HiAcademicCap } from "react-icons/hi2";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../../contexts/ThemeContext";
import { AiFillBank, AiOutlineFolder } from "react-icons/ai";
import { LuBookCopy, LuBookMarked } from "react-icons/lu";

const DashBoardMenuList = () => {
  const { theme, colorBgContainer } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (key: string) => {
    switch (key) {
      case "signin":
        navigate("/auth/login");
        break;
      case "signup":
        navigate("/auth/signup");
        break;
      case "dashboards":
        navigate("/");
        break;
      default:
        navigate(`/${key}`);
        break;
    }
  };

  // Determine the selected key based on the current URL
  const selectedKey = location.pathname.slice(1) || "dashboards"; // Default to "dashboards" if pathname is empty

  const menuItems: ItemType<MenuItemType>[] = [
    { key: "dashboards", icon: <HomeOutlined />, label: "Dashboards" },
    { key: "users", icon: <FaRegUser />, label: "Users" },
    { key: "teachers", icon: <FaChalkboardTeacher />, label: "Teachers" },
    { key: "students", icon: <FaChalkboardTeacher />, label: "Students" },
    {
      key: "center", // Dropdown for Center
      label: "Center",
      icon: <AiFillBank />,
      children: [
        { key: "building", icon: <SiGoogleclassroom />, label: "Building" },
        // { key: "classroom", icon: <SiGoogleclassroom />, label: "Classroom" },
        { key: "classes", icon: <SiGoogleclassroom />, label: "Classes" },
        // Thêm menulist vào sau nếu cần
      ],
    },
    {
      key: "academic", // Dropdown for Academic
      label: "Academic",
      icon: <HiAcademicCap />,
      children: [
        { key: "courses", icon: <LuBookMarked />, label: "Courses" },
        { key: "coursefamily", icon: <LuBookCopy />, label: "Courses Family" },
        { key: "module", icon: <AiOutlineFolder />, label: "Module" },
        // Thêm menulist vào sau nếu cần
      ],
    },
  ];

  return (
    <div>
      <Menu
        items={menuItems}
        selectedKeys={[selectedKey]}
        defaultSelectedKeys={["dashboards"]}
        theme={theme}
        mode="inline"
        onClick={({ key }) => handleMenuClick(key)}
        style={{
          background: colorBgContainer,
          fontSize: "0.9rem",
        }}
        className="flex text-lg from-inherit flex-col mt-2 overflow-auto scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-100"
      />
    </div>
  );
};

export default DashBoardMenuList;
