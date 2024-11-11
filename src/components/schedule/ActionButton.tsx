import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";

interface Props {
  onNewClick: () => void;
  label: string;
}

const ActionButtons = ({ onNewClick, label }: Props) => {
  return (
    <Button type="primary" icon={<PlusOutlined />} onClick={onNewClick}>
      {label}
    </Button>
  );
};

export default ActionButtons;
