import { Form, Input, InputNumber, Modal, notification } from "antd";
import { useEffect } from "react";
import { Module } from "../../models/courses.model";
import { moduleService } from "../../services/module-serice/module.service";

interface EditModuleFormProps {
  isModalVisible: boolean;
  hideModal: () => void;
  module: Module | null;
  onUpdate: () => void;
}

const EditModuleForm = ({
  isModalVisible,
  hideModal,
  module,
  onUpdate,
}: EditModuleFormProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (module) {
      // Đặt giá trị của form khi mở modal với dữ liệu của giang vien
      form.setFieldsValue({
        module_id: module.module_id,
        module_name: module.module_name,
        exam_type: module.exam_type,
        number_of_classes: module.number_of_classes,
      });
    }
  }, [module, form]);

  // Xử lý khi nhấn nút "OK"
  const handleOk = async () => {
    Modal.confirm({
      title: "Are you sure you want to update this module?",
      okText: "Update",
      okType: "danger",
      onOk: async () => {
        try {
          const values = await form.validateFields();
          const updatedModule = {
            ...module,
            ...values,
          };
          await moduleService.update(updatedModule.module_id, updatedModule);
          form.resetFields();
          hideModal();
          onUpdate();
          notification.success({ message: "Module updated successfully" });
        } catch (error) {
          notification.error({ message: "Error updating Module" });
        }
      },
    });
  };

  return (
    <Modal
      title="Edit Module"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        hideModal();
      }}
      okText="Update"
      cancelText="Cancel"
      centered
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="module_name"
          label="Module Name"
          rules={[
            {
              required: true,
              message: "Please input the Module Name!",
            },
          ]}
        >
          <Input placeholder="Enter the Module Name" />
        </Form.Item>
        <Form.Item
          name="exam_type"
          label="Exam Type"
          rules={[
            {
              required: true,
              message: "Please input the Exam Type!",
            },
          ]}
        >
          <Input placeholder="Enter the Exam Type" />
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

export default EditModuleForm;
