import {
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { AdmissionProgram } from "../../models/admission.model";
import { ApplicationDocument } from "../../models/applicationdocument.model";
import applicationDocumentsService from "../../services/application-documents-service/application.documents.service";
import admissionService from "../../services/admission-program-service/admission.service";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface AddAdmissionProgramFormProps {
  visible: boolean;
  hideModal: () => void;
  onAdmissionProgramCreated: () => void;
}

const AddAdmissionProgramForm: React.FC<AddAdmissionProgramFormProps> = ({
  visible,
  hideModal,
  onAdmissionProgramCreated,
}) => {
  const [form] = Form.useForm();
  const [applicationDocuments, setApplicationDocuments] = useState<
    ApplicationDocument[]
  >([]);
  const [selectedAdmissionProgram, setSelectedAdmissionProgram] = useState<
    number[]
  >([]);

  useEffect(() => {
    const fetchApplicationDocuments = async () => {
      const applicationDocuments = await applicationDocumentsService.getAll();
      setApplicationDocuments(applicationDocuments.data);
    };

    if (visible) {
      fetchApplicationDocuments();
    }
  }, [visible]);

  const onFinish = async () => {
    try {
      const values = await form.validateFields();
      const newAdmissionProgram: AdmissionProgram = {
        ...values,
        name: values.name,
        description: values.description,
        startDate: values.period[0].format("YYYY-MM-DD"),
        endDate: values.period[1].format("YYYY-MM-DD"),
        startRegistration: values.period[0].format("YYYY-MM-DD"),
        endRegistration: values.period[1].format("YYYY-MM-DD"),
        applicationDocumentIds: selectedAdmissionProgram,
      };

      await admissionService.add(newAdmissionProgram);
      notification.success({
        message: "Thêm chương trình tuyển sinh thành công",
      });
      hideModal();
      onAdmissionProgramCreated();
      form.resetFields();
    } catch (error) {
      notification.error({ message: "Lỗi khi thêm chương trình tuyển sinh" });
    }
  };

  const handleChange = (checkedValues: number[]) => {
    setSelectedAdmissionProgram(checkedValues);
  };

  return (
    <Modal
      title="Tạo mới chương trình tuyển sinh"
      visible={visible}
      onCancel={hideModal}
      onOk={() => form.submit()}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true }]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item name="period" label="Thời gian" rules={[{ required: true }]}>
          <RangePicker />
        </Form.Item>
        <Form.Item
          name="startRegistration"
          label="Thời gian đăng ký"
          rules={[{ required: true }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="endRegistration"
          label="Thời gian đóng đơn"
          rules={[{ required: true }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="quota"
          label="Số lượng học bổng"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item
          name="applicationDocuments"
          label="Chọn các tài liệu đăng ký"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn ít nhất một tài liệu đăng ký!",
            },
          ]}
          valuePropName="checked"
        >
          <Checkbox.Group onChange={handleChange} style={{ width: "100%" }}>
            {applicationDocuments.map((applicationDocument) => (
              <Checkbox
                key={applicationDocument.id}
                value={applicationDocument.id}
              >
                {applicationDocument.name}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddAdmissionProgramForm;
