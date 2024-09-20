import { DatePicker, Form, Input, Modal, notification } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { studentService } from "../../services/student-service/student.service";
import { Student } from "../../models/student.model";

interface EditStudentFormProps {
  isModalVisible: boolean;
  hideModal: () => void;
  student: Student | null; // Sinh viên cần chỉnh sửa
  onUpdate: () => void; // Hàm gọi lại để cập nhật danh sách sinh viên sau khi chỉnh sửa
}

const EditStudentForm = ({
  isModalVisible,
  hideModal,
  student,
  onUpdate,
}: EditStudentFormProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (student) {
      form.setFieldsValue({
        studentId: student.studentId,
        name: student.name,
        birthDate: dayjs(student.birthDate),
      });
    }
  }, [student, form]);

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
            ...student,
            ...values,
            birthDate,
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

export default EditStudentForm;
