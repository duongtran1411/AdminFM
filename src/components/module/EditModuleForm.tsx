import {
  DeleteOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Select,
  Checkbox,
} from "antd";
import { useEffect, useState } from "react";
import { ExamType, Module } from "../../models/courses.model";
import { Semester } from "../../models/semester.model";
import { moduleService } from "../../services/module-serice/module.service";
import semesterService from "../../services/semester-service/semester.service";

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
  const [loading, setLoading] = useState(false);
  const [semesters, setSemesters] = useState<Semester[]>([]);

  const fetchExamTypes = async () => {
    try {
      const response = await moduleService.getAllExamTypes();
      setExamTypes(response.data);
    } catch (error) {
      console.error("Error fetching exam types:", error);
    }
  };

  const fetchSemesters = async () => {
    try {
      const semesters = await semesterService.findAll();
      setSemesters(semesters);
    } catch (error) {
      console.error("Error fetching semesters:", error);
    }
  };

  useEffect(() => {
    fetchExamTypes();
    fetchSemesters();
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
              isResit: comp.isResit,
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
        semester_id: module.semester?.id,
        gradeCategories: gradeCategoriesWithComponents,
      });
    }
  }, [module, form]);

  const calculateCategoryWeight = (components: any[] = []) => {
    const sum = components.reduce((sum, comp) => {
      const weight = parseFloat(comp?.weight) || 0;
      return sum + weight;
    }, 0);
    return Math.round(sum);
  };

  const handleOk = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const updatedGradeCategories =
        values.gradeCategories?.map((category: any) => {
          const categoryId = category.id || undefined;

          const gradeComponents = (category.gradeComponents || []).map(
            (component: any) => ({
              id: component.id || undefined,
              name: component.name,
              weight: component.weight
                ? Math.round(parseFloat(component.weight) * 10) / 10
                : null,
              isResit: !!component.isResit,
            }),
          );

          return {
            id: categoryId,
            name: category.name,
            gradeComponents: gradeComponents,
          };
        }) || [];

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
      notification.success({ message: "Cập nhật Module thành công!" });
    } catch (error) {
      console.error("Error updating module:", error);
      notification.error({ message: "Lỗi cập nhật Module" });
    } finally {
      setLoading(false);
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
      title="Cập nhật Module"
      open={isModalVisible}
      onCancel={hideModal}
      footer={null}
      width={800}
      confirmLoading={loading}
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
          name="semester_id"
          label="Kỳ học"
          rules={[{ required: true, message: "Vui lòng nhập Kỳ học!" }]}
        >
          <Select placeholder="Chọn Kỳ học">
            {semesters.map((semester) => (
              <Select.Option key={semester.id} value={semester.id}>
                {semester.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.List name="gradeCategories">
          {(fields, { add: _, remove: removeCategory }) => (
            <>
              <div style={{ marginBottom: 16, fontWeight: "500" }}>
                Danh mục điểm
              </div>
              {fields.map((field, _) => (
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

                  <Form.List name={[field.name, "gradeComponents"]}>
                    {(
                      componentFields,
                      { add: addComponent, remove: removeComponent },
                    ) => (
                      <div style={{ flex: 2, marginRight: 8 }}>
                        {componentFields.map((componentField, _) => (
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
                            <Form.Item
                              {...componentField}
                              name={[componentField.name, "isResit"]}
                              valuePropName="checked"
                              style={{ marginRight: 8 }}
                            >
                              <Checkbox>Có thể thi lại</Checkbox>
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
          <Button
            onClick={hideModal}
            style={{ marginRight: 8 }}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            type="primary"
            onClick={handleOk}
            loading={loading}
            disabled={loading}
          >
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditModuleForm;
