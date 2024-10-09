import React from "react";
import { Spin } from "antd";

const Loading: React.FC = () => (
  <div style={{ textAlign: "center", paddingTop: "20px" }}>
    <Spin size="large" />
  </div>
);

export default Loading;
