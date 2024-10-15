import { Form, Input, Modal, notification } from "antd";
import { useEffect } from "react";
import { Application } from "../../models/application.model";
import applicationService from "../../services/application-service/application.service";
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
      });
    }
  }, [application, form]);

  // Xử lý khi nhấn nút "OK"
  const handleOk = async () => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn cập nhật thành phần hồ sơ này?",
      okText: "Cập nhật",
      okType: "danger",
      onOk: async () => {
        try {
          const values = await form.validateFields();

          const updatedApplication = {
            ...application,
            ...values,
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
      title="Chỉnh sửa thành phần hồ sơ"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields(); 
        hideModal();
      }}
      okText="Cập nhật"
      cancelText="Hủy"
      centered
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên thành phần hồ sơ"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên thành phần hồ sơ!",
            },
          ]}
        >
          <Input placeholder="Nhập tên thành phần hồ sơ" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditApplicationForm;
