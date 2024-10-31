import {
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Select,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { studentService } from "../../services/student-service/student.service";
import { Student } from "../../models/student.model";
import { CoursesFamily } from "../../models/courses.model";
import courseFamilyService from "../../services/course-family-service/course.family.service";
import { StudentStatus } from "../../models/enum/student.status.enum";

interface EditStudentFormProps {
  isModalVisible: boolean;
  hideModal: () => void;
  student: Student | null;
  onUpdate: () => void;
}

const EditStudentForm = ({
  isModalVisible,
  hideModal,
  student,
  onUpdate,
}: EditStudentFormProps) => {
  const [form] = Form.useForm();
  const [coursesFamily, setCoursesFamily] = useState<CoursesFamily[]>([]);

  useEffect(() => {
    const fetchCourseFamily = async () => {
      const cfm = await courseFamilyService.getAll();
      setCoursesFamily(cfm);
    };
    fetchCourseFamily();
    if (student) {
      form.setFieldsValue({
        studentId: student.studentId,
        name: student.name,
        birthdate: dayjs(student.birthdate),
        gender: student.gender,
        phone: student.phone,
        email: student.email,
        coursesFamilyName: student.coursesFamily.course_family_id,
        cohort: student.cohort?.name,
        permanentResidence: student.permanentResidence,
        status: student.status,
      });
    }
  }, [student, form]);

  const handleOk = async () => {
    Modal.confirm({
      title: "Are you sure you want to update this student?",
      okText: "Update",
      okType: "danger",
      onOk: async () => {
        try {
          const values = await form.validateFields();
          const birthdate = dayjs(values.birthdate).format("YYYY-MM-DD");
          const updatedStudent = {
            ...student,
            ...values,
            birthdate,
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
      title="Tạo sinh viên mới"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={hideModal}
      okText="Create"
      cancelText="Cancel"
      centered
      width={700} // Increase modal width to match EditStudentForm
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="studentId" label="Mã SV">
              <Input placeholder="Nhập mã SV" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Họ và tên"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
            >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Input placeholder="Nhập số điện thoại của bạn" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="birthdate"
              label="Ngày sinh"
              rules={[{ required: true, message: "Vui lòng nhập ngày sinh!" }]}
            >
              <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="gender"
              label="Giới tính"
              rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
            >
              <Select placeholder="Chọn giới tính">
                <Select.Option value="Nam">Nam</Select.Option>
                <Select.Option value="Nữ">Nữ</Select.Option>
                <Select.Option value="Khác">Khác</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input placeholder="Nhập Email" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="coursesFamilyName"
              label="Courses Family"
              rules={[
                { required: true, message: "Vui lòng chọn courses family!" },
              ]}
            >
              <Select placeholder="Chọn Courses Family">
                {coursesFamily.map((c) => (
                  <Select.Option
                    key={c.course_family_id}
                    value={c.course_family_id}
                  >
                    {c.course_family_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="cohort"
              label="Cohort"
              rules={[{ required: false, message: "Vui lòng nhập cohort!" }]}
            >
              <Input placeholder="Nhập cohort" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="status" label="Trạng thái">
              <Select placeholder="Chọn trạng thái">
                {Object.entries(StudentStatus).map(([key, value]) => (
                  <Select.Option key={key} value={key}>
                    {value}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="permanentResidence"
              label="Nơi sinh sống thường trú"
            >
              <Input placeholder="Nhập nơi sinh sống thường trú" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EditStudentForm;
