import { Form, Input, Modal, notification } from "antd";
import { Building } from "../../models/building.model";
import buildingService from "../../services/building-service/building.service";

interface Props {
  isModalVisible: boolean;
  hideModal: () => void;
  onBuildingCreated: () => void;
}

const AddBuildingForm = ({
  isModalVisible,
  hideModal,
  onBuildingCreated,
}: Props) => {
  const [form] = Form.useForm();

  // Xử lý khi nhấn nút "OK"
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const newBuilding: Building = {
        ...values,
      };
      await buildingService.addBuilding(newBuilding);
      onBuildingCreated();
      notification.success({ message: "Building created successfully!" });
      form.resetFields();
      hideModal();
    } catch (info) {
      console.log("Validate Failed:", info);
    }
  };

  return (
    <Modal
      title="Create New Building"
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
          label="Building name"
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

export default AddBuildingForm;
