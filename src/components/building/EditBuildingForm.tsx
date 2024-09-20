import { Form, Input, Modal, notification } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { Building } from "../../models/building.model";
import buildingService from "../../services/building-service/building.service";
interface EditBuildingFormProps {
  isModalVisible: boolean;
  hideModal: () => void;
  building: Building | null; // Sinh viên cần chỉnh sửa
  onUpdate: () => void; // Hàm gọi lại để cập nhật danh sách sinh viên sau khi chỉnh sửa
}

const EditBuildingForm = ({
  isModalVisible,
  hideModal,
  building,
  onUpdate,
}: EditBuildingFormProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (building) {
      // Đặt giá trị của form khi mở modal với dữ liệu của sinh viên
      form.setFieldsValue({
        name: building.name,
      });
    }
  }, [building, form]);

  // Xử lý khi nhấn nút "OK"
  const handleOk = async () => {
    Modal.confirm({
      title: "Are you sure you want to update this Building?",
      okText: "Update",
      okType: "danger",
      onOk: async () => {
        try {
          const values = await form.validateFields();
          const updatedBuilding = {
            ...building,
            ...values,
          };
          await buildingService.updateBuilding(
            updatedBuilding.id,
            updatedBuilding,
          );
          form.resetFields();
          hideModal();
          onUpdate();
          notification.success({ message: "Building updated successfully" });
        } catch (error) {
          notification.error({ message: "Error updating Building" });
        }
      },
    });
  };

  return (
    <Modal
      title="Edit Building"
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
          label="Building Name"
          rules={[
            { required: true, message: "Please input the building's name!" },
          ]}
        >
          <Input placeholder="Enter building's name" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditBuildingForm;
