import { Checkbox, Form, Input, InputNumber, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { Module } from "../../models/courses.model";
import { moduleService } from "../../services/module-serice/module.service";
import { GradeCategory } from "../../models/gradecategory.model";
import gradeCategoryService from "../../services/grade-service/grade.category.service";

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
  const [gradeCategory, setGradeCategory] = useState<GradeCategory[]>([]);

  useEffect(() => {
    const fetchGradeCategories = async () => {
      const response = await gradeCategoryService.getAll();
      setGradeCategory(response.data);
    };

    fetchGradeCategories();

    if (module) {
      form.setFieldsValue({
        module_id: module.module_id,
        module_name: module.module_name,
        code: module.code,
        exam_type: module.exam_type,
        number_of_classes: module.number_of_classes,
        term_number: module.term_number,
        gradeCategories: module.gradeCategories?.map((category) => category.id),
      });
    }
  }, [module, form]);

  const handleOk = async () => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn cập nhật môn học này không?",
      okText: "Cập nhật",
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
          name="code"
          label="Code"
          rules={[
            {
              required: true,
              message: "Please input the Code!",
            },
          ]}
        >
          <Input placeholder="Enter the Code" />
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
        <Form.Item
          name="term_number"
          label="Term"
          rules={[{ required: true, message: "Vui lòng nhập Term!" }]}
        >
          <InputNumber placeholder="Nhập Term Number" />
        </Form.Item>
        <Form.Item
          name="gradeCategories"
          label="Chọn các đầu điểm"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn ít nhất một đầu điểm!",
            },
          ]}
        >
          <Checkbox.Group style={{ width: "100%" }}>
            {gradeCategory.map((gradeCategory) => (
              <Checkbox key={gradeCategory.id} value={gradeCategory.id}>
                {gradeCategory.name}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditModuleForm;
