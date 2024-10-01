// components/class/AddClassForm.tsx
import { Button, Form, Input, Modal, Select, Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import { CoursesFamily } from "../../models/courses.model";
import courseFamilyService from "../../services/course-family-service/course.family.service";
import { Shifts } from "../../models/shifts";
import { shiftsService } from "../../services/shifts-service/shifts.service";
import { Class } from "../../models/class.model";

interface AddClassFormProps {
  visible: boolean;
  onAdd: (values: Class) => void;
  onCancel: () => void;
}

const AddClassForm: React.FC<AddClassFormProps> = ({
  visible,
  onAdd,
  onCancel,
}) => {
  const [coursesfamily, setCoursesFamily] = useState<CoursesFamily[]>([]);
  const [shift, setShift] = useState<Shifts[]>([]);

  useEffect(() => {
    const fetchCourse = async () => {
      const cfm = await courseFamilyService.getAll();
      setCoursesFamily(cfm);
    };
    const fetchShift = async () => {
      const shift = await shiftsService.findAll();
      setShift(shift);
    };
    if (visible) {
      fetchCourse();
      fetchShift();
    }
  }, [visible]);
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    const classData: Class = {
      ...values,
      tick: values.isActive || false,
    };
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
        <Form.Item
          name="shiftId"
          label="Shift"
          rules={[
            {
              required: true,
              message: "Please select the Shift!",
            },
          ]}
        >
          <Select placeholder="Chọn Shift">
            {shift.map((s) => (
              <Select.Option key={s.id} value={s.id}>
                {s.name}
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
