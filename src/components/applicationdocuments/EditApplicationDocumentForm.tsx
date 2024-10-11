import { Form, Input, Modal, notification } from "antd";
import { useEffect } from "react";
import { ApplicationDocument } from "../../models/applicationdocument.model";
import applicationDocumentsService from "../../services/application-documents-service/application.documents.service";
interface EditApplicationDocumentForm {
  isModalVisible: boolean;
  hideModal: () => void;
  applicationDocument: ApplicationDocument | null;
  onUpdate: () => void;
}

const EditApplicationDocumentForm = ({
  isModalVisible,
  hideModal,
  applicationDocument,
  onUpdate,
}: EditApplicationDocumentForm) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (applicationDocument) {
      form.setFieldsValue({
        name: applicationDocument.name,
      });
    }
  }, [applicationDocument, form]);

  // Xử lý khi nhấn nút "OK"
  const handleOk = async () => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn cập nhật thành phần hồ sơ này?",
      okText: "Cập nhật",
      okType: "danger",
      onOk: async () => {
        try {
          const values = await form.validateFields();

          const updatedApplicationDocument = {
            ...applicationDocument,
            ...values,
          };
          await applicationDocumentsService.update(
            updatedApplicationDocument.id,
            updatedApplicationDocument,
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
        form.resetFields(); // Reset các trường form khi đóng modal
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

export default EditApplicationDocumentForm;
