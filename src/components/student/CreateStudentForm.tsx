import { DatePicker, Form, Input, Modal, notification } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { studentService } from "../../services/student-service/student.service";
import { Student } from "../../models/student.model";

interface Props {
  isModalVisible: boolean;
  hideModal: () => void;
  onStudentCreated: () => void;
}

const CreateStudentForm = ({
  isModalVisible,
  hideModal,
  onStudentCreated,
}: Props) => {
  const [form] = Form.useForm();
  const { classId } = useParams();

  // Xử lý khi nhấn nút "OK"
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const birthDate = dayjs(values.birthDate).format("DD-MM-YYYY");
      const newStudent: Student = {
        ...values,
        birthDate,
        class: classId,
      };
      await studentService.create(newStudent);
      // Cập nhật danh sách sinh viên bằng cách thêm sinh viên mới
      onStudentCreated(); // Gọi hàm callback từ `StudentPage` để thêm sinh viên mới vào danh sách
      notification.success({ message: "Student created successfully!" });
      form.resetFields();
      hideModal();
    } catch (info) {
      console.log("Validate Failed:", info);
    }
  };

  useEffect(() => {
    // Set giá trị cho trường `classId` khi form mở
    form.setFieldsValue({ classId });
  }, [classId, form]);

  return (
    <Modal
      title="Create New Student"
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
          <DatePicker
            format="YYYY-MM-DD"
            style={{ width: "100%" }} // Full width
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateStudentForm;
