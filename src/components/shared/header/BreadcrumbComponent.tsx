import React from "react";
import { Breadcrumb } from "antd";
import { useLocation, Link } from "react-router-dom";

const BreadcrumbComponent: React.FC = () => {
  const location = useLocation();

  // Hàm chuyển đổi URL path thành các item cho Breadcrumb
  const generateBreadcrumbItems = () => {
    const pathSnippets = location.pathname.split("/").filter((i) => i);
    const breadcrumbItems = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      return {
        title: <Link to={url}>{url.replace("/", "").toUpperCase()}</Link>,
        key: url,
      };
    });
    return [
      {
        title: <Link to="/">Dashboard</Link>,
        key: "home",
      },
      ...breadcrumbItems,
    ];
  };

  return (
    <Breadcrumb
      style={{ margin: "24px 28px" }}
      items={generateBreadcrumbItems()}
    />
  );
};

export default BreadcrumbComponent;
