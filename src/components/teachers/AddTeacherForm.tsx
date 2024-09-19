import { DatePicker, Form, Input, Modal, notification, Select } from "antd";
import { Teachers } from "../../models/teacher.model";
import { teacherService } from "../../services/teacher-service/teacher.service";
import dayjs from "dayjs";

interface Props {
  isModalVisible: boolean;
  hideModal: () => void;
  onTeacherCreated: () => void;
}

const AddTeacherForm = ({
  isModalVisible,
  hideModal,
  onTeacherCreated,
}: Props) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const birthDate = dayjs(values.birthdate).format("YYYY-MM-DD");
      const workingDate = dayjs().format("YYYY-MM-DD"); // Lấy ngày hiện tại

      const newTeacher: Teachers = {
        ...values,
        birthdate: birthDate,
        working_date: workingDate, // Gán ngày hiện tại cho working_date
      };

      await teacherService.create(newTeacher);
      onTeacherCreated();
      notification.success({ message: "Teacher created successfully!" });
      form.resetFields();
      hideModal();
    } catch (info) {
      console.log("Validate Failed:", info);
    }
  };

  return (
    <Modal
      title="Tạo mới Giảng Viên"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={hideModal}
      okText="Create"
      cancelText="Cancel"
      centered
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên giảng viên"
          rules={[
            {
              required: true,
              message: "Please input the name!",
            },
          ]}
        >
          <Input placeholder="Nhập tên giảng viên" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="SĐT"
          rules={[
            {
              required: true,
              message: "Please input the phone number!",
            },
          ]}
        >
          <Input placeholder="Nhập SĐT" />
        </Form.Item>
        <Form.Item
          name="gender"
          label="Giới tính"
          rules={[
            {
              required: true,
              message: "Please select the gender!",
            },
          ]}
        >
          <Select placeholder="Chọn giới tính">
            <Select.Option value="nam">Nam</Select.Option>
            <Select.Option value="nu">Nữ</Select.Option>
            <Select.Option value="khac">Khác</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              message: "Please input the email!",
            },
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
          ]}
        >
          <Input placeholder="Nhập Email" />
        </Form.Item>
        <Form.Item
          name="birthdate"
          label="Ngày Sinh"
          rules={[
            {
              required: true,
              message: "Please input the teacher's birth date!",
            },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTeacherForm;
