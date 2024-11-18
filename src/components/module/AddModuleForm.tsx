import { Button, Form, Input, Modal, notification, Select } from "antd";
import {
  DeleteOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { moduleService } from "../../services/module-serice/module.service";
import { ExamType } from "../../models/courses.model";
import { useState, useEffect } from "react";

interface AddModuleFormProps {
  isModalVisible: boolean;
  hideModal: () => void;
  onModuleCreated: () => void;
}

const AddModuleForm: React.FC<AddModuleFormProps> = ({
  isModalVisible,
  hideModal,
  onModuleCreated,
}) => {
  const [form] = Form.useForm();
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);

  const fetchExamTypes = async () => {
    try {
      const response = await moduleService.getAllExamTypes();
      setExamTypes(response.data);
    } catch (error) {
      notification.error({ message: "Lỗi khi tải loại thi" });
    }
  };

  useEffect(() => {
    fetchExamTypes();
  }, []);

  const onFinish = async (values: any) => {
    try {
      await moduleService.add(values);
      notification.success({ message: "Tạo môn học thành công!" });
      form.resetFields();
      hideModal();
      onModuleCreated();
    } catch (error) {
      notification.error({ message: "Lỗi khi tạo môn học" });
    }
  };

  return (
    <Modal
      title="Thêm môn học mới"
      open={isModalVisible}
      onCancel={hideModal}
      footer={null}
      width={800}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="module_name"
          label="Tên môn học"
          rules={[{ required: true, message: "Vui lòng nhập tên môn học" }]}
        >
          <Input placeholder="Nhập tên môn học" />
        </Form.Item>
        <Form.Item
          name="code"
          label="Mã môn học"
          rules={[{ required: true, message: "Vui lòng nhập mã môn học" }]}
        >
          <Input placeholder="Nhập mã môn học" />
        </Form.Item>
        <Form.Item
          name="exam_type"
          label="Loại thi"
          rules={[{ required: true, message: "Vui lòng chọn loại thi" }]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn hình thức thi"
            options={examTypes.map((examType) => ({
              label: examType.name,
              value: examType.id,
            }))}
          />
        </Form.Item>
        <Form.Item
          name="number_of_classes"
          label="Số buổi"
          rules={[{ required: true, message: "Vui lòng nhập số buổi" }]}
        >
          <Input type="number" placeholder="Nhập số buổi" />
        </Form.Item>
        <Form.Item
          name="term_number"
          label="Term NO."
          rules={[{ required: true, message: "Vui lòng nhập Term NO." }]}
        >
          <Input type="number" placeholder="Nhập Term NO." />
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
                              <Input type="number" placeholder="Trọng số" />
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
          <Button type="primary" htmlType="submit">
            Thêm môn học
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddModuleForm;
