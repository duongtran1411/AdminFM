import {
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import { CreateAdmissionProgramRequest } from "../../models/admission.model";
import { ApplicationDocument } from "../../models/applicationdocument.model";
import { Promotion } from "../../models/promotions.model";
import admissionService from "../../services/admission-program-service/admission.service";
import applicationDocumentsService from "../../services/application-documents-service/application.documents.service";
import promotionsService from "../../services/promotions-service/promotions.service";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface AddAdmissionProgramFormProps {
  open: boolean;
  hideModal: () => void;
  onAdmissionProgramCreated: () => void;
}

const AddAdmissionProgramForm: React.FC<AddAdmissionProgramFormProps> = ({
  open,
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
  const [promotions, setPromotions] = useState<Promotion[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await applicationDocumentsService.getAll();
      const promotionResponse = await promotionsService.getPromotions();
      const documents = response.data;
      const promotion = promotionResponse.data;
      setApplicationDocuments(documents);
      setPromotions(promotion);
      setSelectedAdmissionProgram(documents.map((doc) => doc.id));

      form.setFieldsValue({
        applicationDocuments: documents.map((doc) => doc.id),
      });
    };

    if (open) {
      fetchData();
    }
  }, [open, form]);

  const onFinish = async () => {
    try {
      const values = await form.validateFields();
      const newAdmissionProgram: CreateAdmissionProgramRequest = {
        name: values.name,
        description: values.description,
        startDate: values.period[0].format("YYYY-MM-DD"),
        endDate: values.period[1].format("YYYY-MM-DD"),
        startRegistration: values.startRegistration.format("YYYY-MM-DD"),
        endRegistration: values.endRegistration.format("YYYY-MM-DD"),
        quota: values.quota,
        applicationDocuments: selectedAdmissionProgram.map((id) => ({ id })),
        promotions: values.promotion
          ? values.promotion.map((id) => ({ id }))
          : [],
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
      title="Thêm chương trình tuyển sinh"
      open={open}
      onCancel={hideModal}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          applicationDocuments: selectedAdmissionProgram, // Ensure initial values are set
        }}
      >
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
          rules={[
            {
              required: true,
              message: "Vui lòng nhập thời gian bắt đầu đăng ký",
            },
          ]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item
          name="endRegistration"
          label="Thời gian đóng đơn"
          dependencies={["startRegistration"]}
          rules={[
            { required: true, message: "Vui lòng nhập thời gian đóng đơn" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const startRegistration = getFieldValue("startRegistration");
                if (
                  !value ||
                  !startRegistration ||
                  startRegistration.isBefore(value)
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    "Thời gian đóng đơn phải lớn hơn thời gian bắt đầu đăng ký",
                  ),
                );
              },
            }),
          ]}
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
        <Form.Item name="promotion" label="Khuyến mãi">
          <Select mode="multiple">
            {promotions?.map((promotion) => (
              <Select.Option key={promotion.id} value={promotion.id}>
                {promotion.name}
              </Select.Option>
            ))}
          </Select>
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
        >
          <Checkbox.Group
            onChange={handleChange}
            style={{ width: "100%" }}
            value={selectedAdmissionProgram}
          >
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
