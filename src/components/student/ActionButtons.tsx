import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
interface Props {
  onNewClick: () => void;
  onImportClick: () => void; // Thêm props cho import
}
const ActionButtons = ({ onNewClick }: Props) => {
  return (
    <div
      style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}
    >
      <Button type="primary" icon={<PlusOutlined />} onClick={onNewClick}>
        Thêm mới Sinh viên
      </Button>
    </div>
  );
};

export default ActionButtons;
