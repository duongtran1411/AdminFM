import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";

interface Props {
  onCourseCreated: () => void;
}

const AddCourseButton = ({ onCourseCreated }: Props) => {
  return (
    <div
      style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}
    >
      <Button type="primary" icon={<PlusOutlined />} onClick={onCourseCreated}>
        New Course
      </Button>
    </div>
  );
};

export default AddCourseButton;
