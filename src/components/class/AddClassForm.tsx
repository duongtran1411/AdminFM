// components/class/AddClassForm.tsx
import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Select,
  InputNumber,
  DatePicker,
} from "antd";
import React, { useEffect, useState } from "react";
import { CoursesFamily } from "../../models/courses.model";
import { Response } from "../../models/response.model";
import { ClassResponse } from "../../services/class-service/class.service";
import courseFamilyService from "../../services/course-family-service/course.family.service";
import { ClassStatus } from "../../models/enum/class.status.enum";
import moment from "moment";

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
  const [autoAddStudents, setAutoAddStudents] = useState<boolean>(false);

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
      courses_family_id: values.course_family_name,
      tick: values.isActive || false,
      studentCount: values.studentCount || 20,
      admissionDate: moment(values.admissionDate).format("YYYY-MM-DD"),
      term_number: values.term_number,
    };
    onAdd(classData);
    form.resetFields();
  };

  const handleAutoAddChange = (e: any) => {
    setAutoAddStudents(e.target.checked);
  };

  const disabledDate = (current: any) => {
    return current && current < moment().startOf("day");
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
          name="term_number"
          label="Term"
          rules={[{ required: true, message: "Vui lòng nhập Term!" }]}
        >
          <InputNumber placeholder="Nhập Term Number" />
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

        <Form.Item
          name="admissionDate"
          label="Ngày nhập học"
          rules={[{ required: true }]}
        >
          <DatePicker disabledDate={disabledDate} />
        </Form.Item>
        <Form.Item name="isActive" valuePropName="checked">
          <Checkbox onChange={handleAutoAddChange}>
            Tự động thêm sinh viên
          </Checkbox>
        </Form.Item>
        {autoAddStudents && (
          <Form.Item
            name="studentCount"
            label="Số lượng sinh viên"
            rules={[
              { required: true, message: "Vui lòng nhập số lượng sinh viên" },
            ]}
          >
            <InputNumber
              min={1}
              placeholder="Nhập số lượng sinh viên"
              style={{ width: "100%" }}
            />
          </Form.Item>
        )}
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
