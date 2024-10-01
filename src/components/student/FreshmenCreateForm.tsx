import { DatePicker, Form, Input, Modal, notification, Select } from "antd";
import dayjs from "dayjs";
import { Freshmen, Student } from "../../models/student.model";
import { studentService } from "../../services/student-service/student.service";
import { useEffect, useState } from "react";
import { CoursesFamily } from "../../models/courses.model";
import courseFamilyService from "../../services/course-family-service/course.family.service";
import { Shifts } from "../../models/shifts";
import { shiftsService } from "../../services/shifts-service/shifts.service";

interface Props {
  isModalVisible: boolean;
  hideModal: () => void;
  onStudentCreated: () => void;
}

const FreshmenCreateForm = ({
  isModalVisible,
  hideModal,
  onStudentCreated,
}: Props) => {
  const [form] = Form.useForm();
  const [coursesfamily, setCoursesFamily] = useState<CoursesFamily[]>([]);
  const [shift, setShift] = useState<Shifts[]>([]);

  useEffect(() => {
    const fetchCourseFamily = async () => {
      const cfm = await courseFamilyService.getAll();
      setCoursesFamily(cfm);
    };
    const fetchShift = async () => {
      const shift = await shiftsService.findAll();
      setShift(shift);
    };
    fetchCourseFamily();
    fetchShift();
  }, []);

  // Xử lý khi nhấn nút "OK"
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const birthDate = dayjs(values.birthDate).format("DD-MM-YYYY");
      const newStudent: Freshmen = {
        ...values,
        coursesFamilyId: values.coursesFamilyName,
        shiftId: values.shiftName,
        birthDate,
      };
      await studentService.createFreshmen(newStudent);
      onStudentCreated(); // Gọi hàm callback từ `StudentPage` để thêm sinh viên mới vào danh sách
      notification.success({ message: "Student created successfully!" });
      form.resetFields();
      hideModal();
    } catch (info) {
      console.log("Validate Failed:", info);
    }
  };

  return (
    <Modal
      title="Create New Freshmen"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={hideModal}
      okText="Create"
      cancelText="Cancel"
      centered
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="studentId"
          label="Student ID"
          rules={[{ required: true, message: "Please input the student ID!" }]}
        >
          <Input placeholder="Enter student ID" />
        </Form.Item>

        <Form.Item
          name="name"
          label="Họ và tên"
          rules={[
            { required: true, message: "Please input the student's name!" },
          ]}
        >
          <Input placeholder="Enter student's name" />
        </Form.Item>
        <Form.Item
          name="coursesFamilyName"
          label="Courses Family"
          rules={[
            {
              required: true,
              message: "Please input the student's courses family!",
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
          name="shiftName"
          label="Shifts"
          rules={[
            {
              required: true,
              message: "Please input the student's shifts!",
            },
          ]}
        >
          <Select placeholder="Chọn Shifts">
            {shift.map((c) => (
              <Select.Option key={c.id} value={c.id}>
                {c.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="birthDate"
          label="Birth Date"
          rules={[
            {
              required: true,
              message: "Please input the student's birth date!",
            },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FreshmenCreateForm;
