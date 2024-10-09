import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";

interface Props {
  onPromotionCreated: () => void;
}

const AddPromotionButton = ({ onPromotionCreated }: Props) => {
  return (
    <div
      style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}
    >
      <Button type="primary" icon={<PlusOutlined />} onClick={onPromotionCreated}>
        New Promotion
      </Button>
    </div>
  );
};

export default AddPromotionButton;
