import { Form, Input, Modal, notification } from "antd";
import { useEffect } from "react";
import { Classroom } from "../../models/classes.model";
import classRoomService from "../../services/class-room-service/class.room.service";
interface EditClassroomForm {
  isModalVisible: boolean;
  hideModal: () => void;
  classroom: Classroom | null; // Sinh viên cần chỉnh sửa
  onUpdate: () => void; // Hàm gọi lại để cập nhật danh sách sinh viên sau khi chỉnh sửa
}

const EditClassroomForm = ({
  isModalVisible,
  hideModal,
  classroom,
  onUpdate,
}: EditClassroomForm) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (classroom) {
      // Đặt giá trị của form khi mở modal với dữ liệu của sinh viên
      form.setFieldsValue({
        name: classroom.name,
      });
    }
  }, [classroom, form]);

  // Xử lý khi nhấn nút "OK"
  const handleOk = async () => {
    Modal.confirm({
      title: "Are you sure you want to update this Classroom?",
      okText: "Update",
      okType: "danger",
      onOk: async () => {
        try {
          const values = await form.validateFields();

          const updatedClassroom = {
            ...classroom,
            ...values,
          };
          await classRoomService.update(updatedClassroom.id, updatedClassroom);
          form.resetFields();
          hideModal();
          onUpdate();
          notification.success({ message: "Classroom updated successfully" });
        } catch (error) {
          notification.error({ message: "Error updating Classroom" });
        }
      },
    });
  };

  return (
    <Modal
      title="Edit Classroom"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields(); // Reset các trường form khi đóng modal
        hideModal();
      }}
      okText="Update"
      cancelText="Cancel"
      centered
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Classroom Name"
          rules={[
            { required: true, message: "Please input the Classroom's name!" },
          ]}
        >
          <Input placeholder="Enter Classroom's name" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditClassroomForm;
