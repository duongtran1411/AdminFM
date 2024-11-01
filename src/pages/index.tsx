import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { CSSProperties } from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "../components/shared/header";
import { useSiderState } from "../hooks/useSiderState";
import CustomSider from "../components/shared/sidebar/CustomSider";

const MainPage = () => {
  const { isCollapsed, isSmallScreen, setIsCollapsed, setIsSmallScreen } =
    useSiderState();

  const contentStyle: CSSProperties = {
    opacity: !isCollapsed && isSmallScreen ? 0.5 : 1,
    pointerEvents: !isCollapsed && isSmallScreen ? "none" : "auto",
    transition: "opacity 0.3s ease",
    minHeight: 360,
  };

  return (
    <Layout style={{ minHeight: "100vh" }} className="flex">
      <CustomSider
        isCollapsed={isCollapsed}
        isSmallScreen={isSmallScreen}
        setIsCollapsed={setIsCollapsed}
        setIsSmallScreen={setIsSmallScreen}
      />
      <Layout
        style={{
          background: "#F7F9FB",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AppHeader />
        <Content className="rounded-lg" style={contentStyle}>
          <div
            style={{
              padding: "10px",
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainPage;
