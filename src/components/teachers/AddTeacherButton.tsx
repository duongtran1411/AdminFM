import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
interface Props {
  onTeacherCreated: () => void;
}
const AddTeacherButton = ({ onTeacherCreated }: Props) => {
  return (
    <div
      style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}
    >
      <Button type="primary" icon={<PlusOutlined />} onClick={onTeacherCreated}>
        Tạo mới Giảng Viên
      </Button>
    </div>
  );
};

export default AddTeacherButton;
