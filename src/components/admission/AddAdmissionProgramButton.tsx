import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";

interface Props {
  onAdmissionProgramCreated: () => void;
}

const AddAdmissionProgramButton = ({ onAdmissionProgramCreated }: Props) => {
  return (
    <div
      style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}
    >
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onAdmissionProgramCreated}
      >
        Thêm chương trình tuyển sinh
      </Button>
    </div>
  );
};

export default AddAdmissionProgramButton;
