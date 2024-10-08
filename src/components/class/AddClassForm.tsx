// components/class/AddClassForm.tsx
import { Button, Checkbox, Form, Input, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { CoursesFamily } from "../../models/courses.model";
import { Response } from "../../models/response.model";
import { ClassResponse } from "../../services/class-service/class.service";
import courseFamilyService from "../../services/course-family-service/course.family.service";

interface AddClassFormProps {
  visible: boolean;
  onAdd: (values: Response<ClassResponse>) => void;
  onCancel: () => void;
}

const AddClassForm: React.FC<AddClassFormProps> = ({
  visible,
  onAdd,
  onCancel,
}) => {
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
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    const classData: Response<ClassResponse> = {
      ...values,
      coursesFamilyId: values.course_family_name,
      tick: values.isActive || false,
    };
    // console.log(classData);
    onAdd(classData);
    form.resetFields();
  };

  return (
    <Modal
      title="Thêm Lớp Học"
      visible={visible}
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
        <Form.Item
          name="course_family_name"
          label="Courses Family"
          rules={[
            {
              required: true,
              message: "Please select the Courses Family!",
            },
          ]}
        >
          <Select placeholder="Chọn Courses Family">
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
        <Form.Item name="isActive" valuePropName="checked">
          <Checkbox>Tự động thêm 20 sinh viên</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Thêm
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddClassForm;
