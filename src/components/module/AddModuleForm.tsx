import { Button, Form, Input, Modal, notification, Select } from "antd";
import {
  DeleteOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { moduleService } from "../../services/module-serice/module.service";
import { ExamType } from "../../models/courses.model";
import { useState, useEffect } from "react";
import { Semester } from "../../models/semester.model";
import semesterService from "../../services/semester-service/semester.service";

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
  const [semesters, setSemesters] = useState<Semester[]>([]);

  const fetchExamTypes = async () => {
    try {
      const response = await moduleService.getAllExamTypes();
      const semesters = await semesterService.findAll();
      setExamTypes(response.data);
      setSemesters(semesters);
    } catch (error) {
      notification.error({ message: "Lỗi khi tải loại thi" });
    }
  };

  useEffect(() => {
    fetchExamTypes();
  }, []);

  const calculateCategoryWeight = (components: any[] = []) => {
    const sum = components.reduce((sum, comp) => {
      const weight = parseFloat(comp?.weight) || 0;
      return sum + weight;
    }, 0);
    return Math.round(sum);
  };

  const onFinish = async (values: any) => {
    try {
      const updatedValues = {
        ...values,
        gradeCategories: values.gradeCategories?.map((category: any) => ({
          ...category,
          gradeComponents: category.gradeComponents?.map((component: any) => ({
            ...component,
            weight: component.weight
              ? Math.round(parseFloat(component.weight))
              : null,
          })),
        })),
      };

      await moduleService.add(updatedValues);
      console.log(updatedValues);
      notification.success({ message: "Tạo môn học thành công!" });
      form.resetFields();
      hideModal();
      onModuleCreated();
    } catch (error) {
      notification.error({ message: "Lỗi khi tạo môn học" });
    }
  };

  const handleAddCategory = () => {
    const currentCategories = form.getFieldValue("gradeCategories") || [];
    const newCategory = {
      name: "",
      gradeComponents: [{ name: "", weight: null }],
    };
    form.setFieldsValue({
      gradeCategories: [...currentCategories, newCategory],
    });
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
          name="semester_id"
          label="Kỳ học"
          rules={[{ required: true, message: "Vui lòng nhập kỳ học" }]}
        >
          <Select
            placeholder="Chọn kỳ học"
            options={semesters.map((semester) => ({
              label: semester.name,
              value: semester.id,
            }))}
          />
        </Form.Item>

        <Form.List name="gradeCategories">
          {(fields, { add: _, remove: removeCategory }) => (
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
                    <Form.Item
                      style={{ marginBottom: 0 }}
                      shouldUpdate={(prevValues, curValues) => {
                        const prevComponents =
                          prevValues?.gradeCategories?.[field.name]
                            ?.gradeComponents;
                        const curComponents =
                          curValues?.gradeCategories?.[field.name]
                            ?.gradeComponents;
                        return (
                          JSON.stringify(prevComponents) !==
                          JSON.stringify(curComponents)
                        );
                      }}
                    >
                      {({ getFieldValue }) => {
                        const components =
                          getFieldValue([
                            "gradeCategories",
                            field.name,
                            "gradeComponents",
                          ]) || [];
                        const totalWeight = calculateCategoryWeight(components);
                        return (
                          <div style={{ color: "#666" }}>
                            Tổng trọng số: {totalWeight}%
                          </div>
                        );
                      }}
                    </Form.Item>
                  </div>

                  <Form.List
                    name={[field.name, "gradeComponents"]}
                    rules={[
                      {
                        validator: async (_, components) => {
                          if (!components || components.length === 0) {
                            throw new Error(
                              "Vui lòng thêm ít nhất một thành phần điểm",
                            );
                          }
                        },
                      },
                    ]}
                  >
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
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng nhập tên thành phần",
                                },
                              ]}
                              style={{ flex: 1, marginRight: 8 }}
                            >
                              <Input placeholder="Tên thành phần" />
                            </Form.Item>
                            <Form.Item
                              {...componentField}
                              name={[componentField.name, "weight"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng nhập trọng số",
                                },
                                {
                                  type: "number",
                                  min: 0,
                                  max: 100,
                                  transform: (value) => Number(value),
                                  message: "Trọng số phải từ 0 đến 100",
                                },
                              ]}
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
                  onClick={handleAddCategory}
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
