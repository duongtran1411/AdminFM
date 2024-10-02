import { DatePicker, Form, Input, Modal, notification, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Freshmen } from "../../models/student.model";
import { studentService } from "../../services/student-service/student.service";
import { CoursesFamily } from "../../models/courses.model";
import { Shifts } from "../../models/shifts";
import courseFamilyService from "../../services/course-family-service/course.family.service";
import { shiftsService } from "../../services/shifts-service/shifts.service";

interface EditFreshmenFormProps {
  isModalVisible: boolean;
  hideModal: () => void;
  freshmen: Freshmen | null; // Sinh viên cần chỉnh sửa
  onUpdate: () => void; // Hàm gọi lại để cập nhật danh sách sinh viên sau khi chỉnh sửa
}

const EditFreshmenForm = ({
  isModalVisible,
  hideModal,
  freshmen,
  onUpdate,
}: EditFreshmenFormProps) => {
  const [form] = Form.useForm();
  const [coursesfamily, setCoursesFamily] = useState<CoursesFamily[]>([]);
  const [shift, setShift] = useState<Shifts[]>([]);
  useEffect(() => {
    if (freshmen) {
      form.setFieldsValue({
        studentId: freshmen.studentId,
        name: freshmen.name,
        birthDate: dayjs(freshmen.birthDate),
        coursesFamilyName: freshmen.coursesFamily.course_family_name,
        shiftName: freshmen.shift.name,
      });
    }
  }, [freshmen, form]);

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
    Modal.confirm({
      title: "Are you sure you want to delete this student?",
      okText: "Update",
      okType: "danger",
      onOk: async () => {
        try {
          const values = await form.validateFields();
          const birthDate = dayjs(values.birthDate).format("YYYY-MM-DD");
          const updatedStudent = {
            ...freshmen,
            ...values,
            birthDate,
            coursesFamily: {
              course_family_name: values.coursesFamilyName,
            },
            shift: values.shiftName,
          };
          await studentService.update(updatedStudent.id, updatedStudent);
          form.resetFields();
          hideModal();
          onUpdate();
          notification.success({ message: "Student updated successfully" });
        } catch (error) {
          notification.error({ message: "Error updating student" });
        }
      },
    });
  };

  return (
    <Modal
      title="Edit Student"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields(); // Reset các trường form khi đóng modal
        hideModal();
      }}
      okText="Update"
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
          label="Name"
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

export default EditFreshmenForm;
