import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";

interface Props {
  onApplicationDocumentCreated: () => void;
}

const AddApplicationDocumentButton = ({
  onApplicationDocumentCreated,
}: Props) => {
  return (
    <div
      style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}
    >
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onApplicationDocumentCreated}
      >
        Thêm mới TP Hồ Sơ
      </Button>
    </div>
  );
};

export default AddApplicationDocumentButton;
