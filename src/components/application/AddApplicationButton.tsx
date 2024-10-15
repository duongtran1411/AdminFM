import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";

interface Props {
  onApplicationCreate: () => void;
}

const AddApplicationButton = ({ onApplicationCreate }: Props) => {
  return (
    <div
      style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}
    >
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onApplicationCreate}
      >
        Thêm hồ sơ
      </Button>
    </div>
  );
};

export default AddApplicationButton;
