import { Form, Input, Modal, notification } from "antd";
import { ApplicationDocument } from "../../models/applicationdocument.model";
import applicationDocumentsService from "../../services/application-documents-service/application.documents.service";

interface Props {
  isModalVisible: boolean;
  hideModal: () => void;
  onApplicationDocumentCreated: () => void;
}

const AddApplicationDocumentForm = ({
  isModalVisible,
  hideModal,
  onApplicationDocumentCreated,
}: Props) => {
  const [form] = Form.useForm();
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const newApplicationDocument: ApplicationDocument = {
        ...values,
      };
      await applicationDocumentsService.add(
        newApplicationDocument,
      );
      onApplicationDocumentCreated();
      notification.success({
        message: "Thành phần hồ sơ được tạo thành công!",
      });
      form.resetFields();
      hideModal();
    } catch (info) {
      console.log("Validate Failed:", info);
    }
  };

  return (
    <Modal
      title="Tạo mới thành phần hồ sơ"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={hideModal}
      okText="Tạo mới"
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

export default AddApplicationDocumentForm;
