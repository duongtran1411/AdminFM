import { HomeOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import { AiFillBank, AiOutlineFolder } from "react-icons/ai";
import { FaChalkboardTeacher, FaRegUser } from "react-icons/fa";
import { HiAcademicCap } from "react-icons/hi2";
import { LuBookCopy, LuBookMarked } from "react-icons/lu";
import { SiGoogleclassroom } from "react-icons/si";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../../contexts/ThemeContext";

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
    {
      key: "tuyensinh",
      label: "Tuyển Sinh",
      icon: <HiAcademicCap />,
      children: [
        {
          key: "admission",
          icon: <LuBookCopy />,
          label: "CT Tuyển Sinh",
        },
        {
          key: "promotions",
          icon: <LuBookCopy />,
          label: "CT Ưu Đãi",
        },
        {
          key: "freshmens",
          icon: <FaChalkboardTeacher />,
          label: "DS Nhập học",
        },
        {
          key: "applicationdocument",
          icon: <AiOutlineFolder />,
          label: "Thành phần hồ sơ",
        },
      ],
    },
    {
      key: "center",
      label: "Center",
      icon: <AiFillBank />,
      children: [
        { key: "students", icon: <SiGoogleclassroom />, label: "Sinh viên" },
        { key: "classes", icon: <SiGoogleclassroom />, label: "Lớp học" },
        { key: "teachers", icon: <FaChalkboardTeacher />, label: "Giảng viên" },
        { key: "building", icon: <SiGoogleclassroom />, label: "Toà nhà" },
        { key: "cohort", icon: <SiGoogleclassroom />, label: "Niên khóa" },
      ],
    },
    {
      key: "academic",
      label: "Academic",
      icon: <HiAcademicCap />,
      children: [
        { key: "coursefamily", icon: <LuBookCopy />, label: "Courses Family" },
        { key: "courses", icon: <LuBookMarked />, label: "Courses" },
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
          fontSize: "0.8rem",
        }}
        className="flex text-lg from-inherit flex-col mt-2 overflow-auto scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-100"
      />
    </div>
  );
};

export default DashBoardMenuList;
