import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const NavigateBack = () => {
  const navigate = useNavigate();

  return (
    <ArrowLeftOutlined
      className="cursor-pointer mb-4"
      onClick={() => navigate(-1)}
    />
  );
};

export default NavigateBack;
