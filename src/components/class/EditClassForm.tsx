// components/class/EditClassForm.tsx
import { Button, Form, Input, InputNumber, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { CoursesFamily } from "../../models/courses.model";
import { ClassStatus } from "../../models/enum/class.status.enum";
import courseFamilyService from "../../services/course-family-service/course.family.service";

interface EditClassFormProps {
  visible: boolean;
  onEdit: (values: any) => void;
  onCancel: () => void;
  initialValues: any;
}

const EditClassForm: React.FC<EditClassFormProps> = ({
  visible,
  onEdit,
  onCancel,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const [coursesfamily, setCoursesFamily] = useState<CoursesFamily[]>([]);

  useEffect(() => {
    const fetchCourse = async () => {
      const cfm = await courseFamilyService.getAll();
      setCoursesFamily(cfm);
    };
    if (visible) {
      fetchCourse();
    }
  }, [visible]);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const handleFinish = (values: any) => {
    onEdit({
      name: values.name,
      courses_family_id: values.course_family_id,
      term_number: values.term_number,
      status: values.status,
      admissionDate: values.admissionDate,
    });
    form.resetFields();
  };

  return (
    <Modal
      title="Chỉnh Sửa Lớp Học"
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Tên Lớp"
          rules={[{ required: true, message: "Vui lòng nhập tên lớp" }]}
        >
          <Input placeholder="Nhập tên lớp" />
        </Form.Item>
        <Form.Item name="course_family_id" label="Courses Family">
          <Select
            placeholder="Chọn Courses Family"
            defaultValue={initialValues.course_family_name}
          >
            {coursesfamily.map((c) => (
              <Select.Option
                key={c.course_family_id}
                value={c.course_family_id}
              >
                {c.course_family_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="term_number"
          label="Term"
          rules={[{ required: true, message: "Vui lòng nhập Term!" }]}
        >
          <InputNumber min={0} placeholder="Nhập Term Number" />
        </Form.Item>
        <Form.Item name="status" label="Trạng thái">
          <Select placeholder="Chọn trạng thái">
            {Object.values(ClassStatus).map((status) => (
              <Select.Option key={status} value={status}>
                {status}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Cập Nhật
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditClassForm;
