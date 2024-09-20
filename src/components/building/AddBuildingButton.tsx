import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
interface Props {
  onNewBuildingClick: () => void;
}
const AddBuildingButton = ({ onNewBuildingClick }: Props) => {
  return (
    <div
      style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}
    >
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onNewBuildingClick}
      >
        Tạo mới toà nhà
      </Button>
    </div>
  );
};

export default AddBuildingButton;
