import { Form, Input, Modal, notification } from "antd";
import { Classroom } from "../../models/classes.model";
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
  const handleOk = async () => {
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
      </Form>
    </Modal>
  );
};

export default AddClassroomForm;
