import { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Modal,
  Button,
  notification,
  Select,
} from "antd";
import { ExamType, Module } from "../../models/courses.model";
import { moduleService } from "../../services/module-serice/module.service";
import {
  MinusCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

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
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);

  const fetchExamTypes = async () => {
    try {
      const response = await moduleService.getAllExamTypes();
      setExamTypes(response.data);
    } catch (error) {
      console.error("Error fetching exam types:", error);
    }
  };

  useEffect(() => {
    fetchExamTypes();
  }, []);

  useEffect(() => {
    if (module) {
      const gradeCategoriesWithComponents =
        module.gradeCategories?.map((category) => ({
          id: category.id,
          name: category.name,
          gradeComponents:
            category.gradeComponents?.map((comp) => ({
              id: comp.id,
              name: comp.name,
              weight: comp.weight,
            })) || [],
        })) || [];

      form.setFieldsValue({
        module_id: module.module_id,
        module_name: module.module_name,
        code: module.code,
        exam_type: module.exam_type.map(
          (exam: { id: number; name: string }) => exam.id,
        ),
        number_of_classes: module.number_of_classes,
        term_number: module.term_number,
        gradeCategories: gradeCategoriesWithComponents,
      });
    }
  }, [module, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const updatedGradeCategories = values.gradeCategories.map(
        (category: any) => ({
          id: category.id || undefined,
          name: category.name,
          gradeComponents:
            category.gradeComponents?.map((component: any) => ({
              id: component.id || undefined,
              name: component.name,
              weight: component.weight,
            })) || [],
        }),
      );

      const updatedModule = {
        ...module,
        ...values,
        exam_type: values.exam_type || [],
        gradeCategories: updatedGradeCategories,
      };
      await moduleService.update(updatedModule.module_id, updatedModule);

      form.resetFields();
      hideModal();
      onUpdate();
      notification.success({ message: "Module updated successfully" });
    } catch (error) {
      console.error("Error updating module:", error);
      notification.error({ message: "Error updating module" });
    }
  };

  return (
    <Modal
      title="Cập nhật Module"
      open={isModalVisible}
      onCancel={() => {
        hideModal();
      }}
      footer={null}
      width={800}
    >
      <Form form={form} layout="vertical" onFinish={handleOk}>
        <Form.Item
          name="module_name"
          label="Tên Module"
          rules={[{ required: true, message: "Vui lòng nhập tên Module!" }]}
        >
          <Input placeholder="Nhập tên Module" />
        </Form.Item>

        <Form.Item
          name="code"
          label="Code"
          rules={[{ required: true, message: "Vui lòng nhập Code!" }]}
        >
          <Input placeholder="Nhập Code" />
        </Form.Item>

        <Form.Item
          name="exam_type"
          label="Exam Type"
          rules={[{ required: true, message: "Vui lòng chọn Exam Type!" }]}
        >
          <Select placeholder="Chọn loại thi" allowClear mode="multiple">
            {examTypes.map((examType) => (
              <Select.Option key={examType.id} value={examType.id}>
                {examType.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="number_of_classes"
          label="Số buổi học"
          rules={[{ required: true, message: "Vui lòng nhập Số buổi học!" }]}
        >
          <InputNumber placeholder="Nhập Số buổi học" />
        </Form.Item>

        <Form.Item
          name="term_number"
          label="Term"
          rules={[{ required: true, message: "Vui lòng nhập Term!" }]}
        >
          <InputNumber placeholder="Nhập Term" />
        </Form.Item>

        <Form.List name="gradeCategories">
          {(fields, { add: addCategory, remove: removeCategory }) => (
            <>
              <div style={{ marginBottom: 16, fontWeight: "500" }}>
                Danh mục điểm
              </div>
              {fields.map((field) => (
                <div
                  key={field.key}
                  style={{
                    display: "flex",
                    marginBottom: 8,
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ flex: 1, marginRight: 8 }}>
                    <Form.Item
                      {...field}
                      name={[field.name, "name"]}
                      rules={[
                        { required: true, message: "Thiếu tên danh mục điểm" },
                      ]}
                    >
                      <Input placeholder="Tên danh mục điểm" />
                    </Form.Item>
                  </div>

                  <Form.List name={[field.name, "gradeComponents"]}>
                    {(
                      componentFields,
                      { add: addComponent, remove: removeComponent },
                    ) => (
                      <div style={{ flex: 2, marginRight: 8 }}>
                        {componentFields.map((componentField) => (
                          <div
                            key={componentField.key}
                            style={{ display: "flex", marginBottom: 8 }}
                          >
                            <Form.Item
                              {...componentField}
                              name={[componentField.name, "name"]}
                              style={{ flex: 1, marginRight: 8 }}
                            >
                              <Input placeholder="Tên thành phần" />
                            </Form.Item>
                            <Form.Item
                              {...componentField}
                              name={[componentField.name, "weight"]}
                              style={{ flex: 1, marginRight: 8 }}
                            >
                              <InputNumber
                                placeholder="Trọng số"
                                suffix="%"
                                min={0}
                                max={100}
                                formatter={(value: any) =>
                                  value !== undefined && value !== null
                                    ? parseFloat(value).toString()
                                    : ""
                                }
                              />
                            </Form.Item>
                            <Button
                              type="text"
                              icon={<MinusCircleOutlined />}
                              onClick={() =>
                                removeComponent(componentField.name)
                              }
                            />
                          </div>
                        ))}
                        <Button
                          type="dashed"
                          onClick={() => addComponent()}
                          icon={<PlusOutlined />}
                          style={{ width: "60%" }}
                        >
                          Thêm thành phần
                        </Button>
                      </div>
                    )}
                  </Form.List>

                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    style={{ color: "red" }}
                    onClick={() => removeCategory(field.name)}
                  />
                </div>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => addCategory()}
                  icon={<PlusOutlined />}
                  style={{ width: "60%" }}
                >
                  Thêm danh mục điểm
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item style={{ marginTop: 24, textAlign: "right" }}>
          <Button onClick={hideModal} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type="primary" onClick={handleOk}>
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditModuleForm;
