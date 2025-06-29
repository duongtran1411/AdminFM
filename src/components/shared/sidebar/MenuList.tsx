import { Menu } from "antd";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import {
  AiFillBank,
  AiOutlineFolder
} from "react-icons/ai";
import { PiStudent } from "react-icons/pi";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../../contexts/ThemeContext";
import { useState } from "react";
import { HomeOutlined } from "@ant-design/icons";
import { FaRegUser } from "react-icons/fa";
import { MdGrade, MdOutlineStarRate } from "react-icons/md";

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

  const selectedKey = location.pathname.slice(1) || "dashboards";
  const menuItems: ItemType<MenuItemType>[] = [
    { key: "dashboards", icon: <HomeOutlined />, label: "Dashboards" },
    { key: "users", icon: <FaRegUser />, label: "Users" },
    {
      key: "tuyensinh",
      label: "Tuyển Sinh",
      icon: <AiOutlineFolder />,
      children: [
        {
          key: "admission",
          icon: <AiOutlineFolder />,
          label: "CT Tuyển Sinh",
        },
        {
          key: "application",
          icon: <AiOutlineFolder />,
          label: "DS Ứng tuyển",
        },
        {
          key: "freshmens",
          icon: <AiOutlineFolder />,
          label: "DS Nhập học",
        },
        {
          key: "promotions",
          icon: <AiOutlineFolder />,
          label: "CT Ưu Đãi",
        },
        {
          key: "applicationdocument",
          icon: <AiOutlineFolder />,
          label: "TP hồ sơ",
        },
      ],
    },
    {
      key: "center",
      label: "Center",
      icon: <AiFillBank />,
      children: [
        { key: "students", icon: <PiStudent />, label: "Sinh viên" },
        { key: "classes", icon: <AiOutlineFolder />, label: "Lớp học" },
        { key: "teachers", icon: <AiOutlineFolder />, label: "Giảng viên" },
        { key: "building", icon: <AiOutlineFolder />, label: "Toà nhà" },
        { key: "cohort", icon: <AiOutlineFolder />, label: "Niên khóa" },
        { key: "examschedule", icon: <AiOutlineFolder />, label: "Lịch thi" },
      ],
    },
    {
      key: "academic",
      label: "Academic",
      icon: <AiOutlineFolder />,
      children: [
        { key: "coursefamily", icon: <AiOutlineFolder />, label: "Courses Family" },
        { key: "courses", icon: <AiOutlineFolder />, label: "Courses" },
        { key: "module", icon: <AiOutlineFolder />, label: "Module" },
        // Thêm menulist vào sau nếu cần
      ],
    },
    { key: "markreport", icon: <MdGrade />, label: "Báo cáo điểm" },
    {
      key: "evaluation",
      icon: <MdOutlineStarRate />,
      label: "Đánh giá cá nhân",
    },
    { key: "re-register-module", icon: <MdGrade />, label: "Đăng ký học lại" },
    {
      key: "student-resit",
      icon: <MdGrade />,
      label: "Danh sách đăng ký học lại",
    },
  ];

  const getAllParentKeys = () => {
    return menuItems
      .filter(
        (item): item is ItemType<MenuItemType> =>
          item !== null && "children" in item,
      )
      .map((item) => String(item?.key));
  };

  const [openKeys, setOpenKeys] = useState<string[]>(getAllParentKeys());

  return (
    <div>
      <Menu
        items={menuItems}
        selectedKeys={[selectedKey]}
        defaultSelectedKeys={["dashboards"]}
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
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
