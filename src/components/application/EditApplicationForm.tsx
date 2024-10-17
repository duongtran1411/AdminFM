import { DatePicker, Form, Input, Modal, notification, Select } from "antd";
import { useEffect } from "react";
import { Application } from "../../models/application.model";
import applicationService from "../../services/application-service/application.service";
import dayjs from "dayjs";

interface EditApplicationPropsForm {
  isModalVisible: boolean;
  hideModal: () => void;
  application: Application | null;
  onUpdate: () => void;
}

const EditApplicationForm = ({
  isModalVisible,
  hideModal,
  application,
  onUpdate,
}: EditApplicationPropsForm) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (application) {
      form.setFieldsValue({
        name: application.name,
        phone: application.phone,
        email: application.email,
        gender: application.gender,
        birthdate: dayjs(application.birthdate),
        permanentResidence: application.permanentResidence,
      });
    }
  }, [application]);

  const handleOk = async () => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn cập nhật thành phần hồ sơ này?",
      okText: "Cập nhật",
      okType: "danger",
      onOk: async () => {
        try {
          const values = await form.validateFields();
          const birthdate = dayjs(values.birthdate).format("YYYY-MM-DD");

          const updatedApplication = {
            ...application,
            ...values,
            birthdate: birthdate,
          };
          await applicationService.update(
            updatedApplication.id,
            updatedApplication,
          );
          form.resetFields();
          hideModal();
          onUpdate();
          notification.success({
            message: "Thành phần hồ sơ cập nhật thành công",
          });
        } catch (error) {
          notification.error({
            message: "Lỗi cập nhật thành phần hồ sơ",
          });
        }
      },
    });
  };

  return (
    <Modal
      title="Chỉnh sửa hồ sơ"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={() => {
        hideModal();
      }}
      okText="Cập nhật"
      cancelText="Hủy"
      centered
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Họ và tên"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input placeholder="Nhập số điện thoại của bạn" />
        </Form.Item>
        <Form.Item
          name="birthdate"
          label="Ngày sinh"
          rules={[{ required: true, message: "Vui lòng nhập ngày sinh!" }]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>
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
        <Form.Item
              name="permanentResidence"
              label="Hộ khẩu thường trú"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập hộ không thường trú!",
                },
              ]}
            >
              <Input placeholder="Nhập hộ không thường trú" />
            </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditApplicationForm;
