import { Form, Input, InputNumber, Modal, notification } from "antd";
import { Module } from "../../models/courses.model";
import { moduleService } from "../../services/module-serice/module.service";

interface Props {
  isModalVisible: boolean;
  hideModal: () => void;
  onModuleCreated: () => void;
}

const AddModuleForm = ({
  isModalVisible,
  hideModal,
  onModuleCreated,
}: Props) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    const values = await form.validateFields();
    const newModule: Module = {
      ...values,
    };
    await moduleService.add(newModule);
    onModuleCreated();
    notification.success({ message: "Module created successfully!" });
    form.resetFields();
    hideModal();
  };

  return (
    <Modal
      title="Create New Module"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={hideModal}
      okText="Create"
      cancelText="Cancel"
      centered
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="module_name"
          label="Module Name"
          rules={[
            { required: true, message: "Please input the Module's name!" },
          ]}
        >
          <Input placeholder="Enter Module's name" />
        </Form.Item>
        <Form.Item
          name="exam_type"
          label="Exam Type"
          rules={[{ required: true, message: "Please input the Exam" }]}
        >
          <Input placeholder="Enter Exam Type" />
        </Form.Item>
        <Form.Item
          name="number_of_classes"
          label="Number of Classes"
          rules={[
            {
              required: true,
              message: "Please input the Number of Classes!",
            },
          ]}
        >
          <InputNumber placeholder="Enter the Number of Classes" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddModuleForm;
