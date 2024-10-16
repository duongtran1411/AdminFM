import { RetweetOutlined } from "@ant-design/icons";
import { Button } from "antd";
interface Props {
  onChangeStatusClick: () => void;
}
const ButtonChangeStatus = ({ onChangeStatusClick }: Props) => {
  return (
    <div
      style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}
    >
      <Button
        type="primary"
        icon={<RetweetOutlined />}
        onClick={onChangeStatusClick}
      >
        Chuyển trạng thái
      </Button>
    </div>
  );
};

export default ButtonChangeStatus;
