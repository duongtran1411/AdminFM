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
import { CoursesFamily } from "../../models/courses.model";
import courseFamilyService from "../../services/course-family-service/course.family.service";
import { StudentStatus } from "../../models/enum/student.status.enum";
import { Cohort } from "../../models/cohort.model";
import cohortService from "../../services/cohort-service/cohort.service";

interface CreateStudentFormProps {
  isModalVisible: boolean;
  hideModal: () => void;
  onCreate: () => void;
}

const CreateStudentForm = ({
  isModalVisible,
  hideModal,
  onCreate,
}: CreateStudentFormProps) => {
  const [form] = Form.useForm();
  const [coursesFamily, setCoursesFamily] = useState<CoursesFamily[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);

  useEffect(() => {
    const fetchCohorts = async () => {
      const data = await cohortService.getAllCohort();
      setCohorts(data.data);
    };
    fetchCohorts();
  }, []);

  useEffect(() => {
    const fetchCourseFamily = async () => {
      const data = await courseFamilyService.getAll();
      setCoursesFamily(data);
    };
    fetchCourseFamily();
  }, []);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const birthdate = dayjs(values.birthdate).format("YYYY-MM-DD");
      const newStudent = { ...values, birthdate };
      await studentService.create(newStudent);
      form.resetFields();
      hideModal();
      onCreate();
      notification.success({ message: "Tạo sinh viên thành công" });
    } catch (error: any) {
      notification.error({ message: error?.response?.data?.message });
    }
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
      width={700}
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
            <Form.Item name="cohort" label="Niên khóa">
              <Select placeholder="Chọn Niên khóa">
                {cohorts.map((cohort) => (
                  <Select.Option key={cohort.id} value={cohort.name}>
                    {cohort.name}
                  </Select.Option>
                ))}
              </Select>
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

export default CreateStudentForm;
