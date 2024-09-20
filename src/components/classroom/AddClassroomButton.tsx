import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
interface Props {
  onNewClassroomClick: () => void;
}
const AddClassroomButton = ({ onNewClassroomClick }: Props) => {
  return (
    <div
      style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}
    >
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onNewClassroomClick}
      >
        Tạo mới phòng học
      </Button>
    </div>
  );
};

export default AddClassroomButton;
