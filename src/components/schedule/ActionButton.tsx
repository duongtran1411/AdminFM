import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";

interface Props {
  onNewClick: () => void;
  isEmpty: boolean;
}

const ActionButtons = ({ onNewClick, isEmpty }: Props) => {
  return (
    <div
      style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}
    >
      <Button type="primary" icon={<PlusOutlined />} onClick={onNewClick}>
        {isEmpty ? "Tạo nhanh lịch học" : "Tạo lịch học"}
      </Button>
    </div>
  );
};

export default ActionButtons;
