import { Menu } from "antd";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import {
  AiFillBank,
  AiOutlineFolder,
  AiOutlineNotification,
} from "react-icons/ai";
import { FaChalkboardTeacher, FaRegBuilding } from "react-icons/fa";
import { GoPeople } from "react-icons/go";
import { HiAcademicCap } from "react-icons/hi2";
import { LuBookCopy, LuBookMarked } from "react-icons/lu";
import { MdGrade, MdOutlineStarRate } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { SiGoogleclassroom } from "react-icons/si";
import { VscGitStashApply } from "react-icons/vsc";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../../contexts/ThemeContext";
import { useState } from "react";

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
    // { key: "dashboards", icon: <HomeOutlined />, label: "Dashboards" },
    // { key: "users", icon: <FaRegUser />, label: "Users" },
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
          key: "application",
          icon: <VscGitStashApply />,
          label: "DS Ứng tuyển",
        },
        {
          key: "freshmens",
          icon: <FaChalkboardTeacher />,
          label: "DS Nhập học",
        },
        {
          key: "promotions",
          icon: <AiOutlineNotification />,
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
        { key: "classes", icon: <SiGoogleclassroom />, label: "Lớp học" },
        { key: "teachers", icon: <FaChalkboardTeacher />, label: "Giảng viên" },
        { key: "building", icon: <FaRegBuilding />, label: "Toà nhà" },
        { key: "cohort", icon: <GoPeople />, label: "Niên khóa" },
        { key: "examschedule", icon: <AiOutlineFolder />, label: "Lịch thi" },
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
