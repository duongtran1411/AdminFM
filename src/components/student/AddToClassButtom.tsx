import { RetweetOutlined } from "@ant-design/icons";
import { Button } from "antd";
interface Props {
  onChangeStatusClick: () => void;
}
const AddToClassButton = ({ onChangeStatusClick }: Props) => {
  return (
    <div
      style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}
    >
      <Button
        type="primary"
        icon={<RetweetOutlined />}
        onClick={onChangeStatusClick}
      >
        Thêm vào lớp
      </Button>
    </div>
  );
};

export default AddToClassButton;
