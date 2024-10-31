import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
interface Props {
  onNewBuildingClick: () => void;
}
const AddCohortButton = ({ onNewBuildingClick }: Props) => {
  return (
    <div
      style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}
    >
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onNewBuildingClick}
      >
        Tạo mới niên khóa
      </Button>
    </div>
  );
};

export default AddCohortButton;
