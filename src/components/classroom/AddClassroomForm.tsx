import { Form, Input, Modal, notification } from "antd";
import { useParams } from "react-router-dom";
import { Classroom } from "../../models/class.model";
import classRoomService from "../../services/class-room-service/class.room.service";

interface Props {
  isModalVisible: boolean;
  hideModal: () => void;
  onClassroomCreated: () => void;
  buildingId: number;
}

const AddClassroomForm = ({
  isModalVisible,
  hideModal,
  onClassroomCreated,
  buildingId,
}: Props) => {
  const [form] = Form.useForm();
  // Xử lý khi nhấn nút "OK"
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const newClassroom: Classroom = {
        ...values,
        buildingId,
      };
      await classRoomService.add(newClassroom);
      onClassroomCreated();
      notification.success({ message: "Classroom created successfully!" });
      form.resetFields();
      hideModal();
    } catch (info) {
      console.log("Validate Failed:", info);
    }
  };

  return (
    <Modal
      title="Tạo mới phòng học"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={hideModal}
      okText="Create"
      cancelText="Cancel"
      centered
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên phòng học"
          rules={[
            { required: true, message: "Please input the Classroom's name!" },
          ]}
        >
          <Input placeholder="Nhập tên phòng học" />
        </Form.Item>
        {/* <Form.Item
          name="building"
          label="Select Modules"
          rules={[
            { required: true, message: "Please select at least one module!" },
          ]}
          valuePropName="checked"
        >
          <Checkbox.Group
            onChange={handleModuleChange}
            style={{ width: "100%" }}
          >
            {modules.map((module) => (
              <Checkbox key={module.module_id} value={module.module_id}>
                {module.module_name}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default AddClassroomForm;
