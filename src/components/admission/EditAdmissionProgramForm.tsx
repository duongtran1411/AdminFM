import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { AdmissionProgram } from "../../models/admission.model";
import { Response } from "../../models/response.model";
import admissionService from "../../services/admission-program-service/admission.service";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface EditAdmissionProgramFormProps {
  isModalVisible: boolean;
  hideModal: () => void;
  admissionProgram: Response<AdmissionProgram> | null;
  onUpdate: () => void;
}

const EditAdmissionProgramForm = ({
  isModalVisible,
  hideModal,
  admissionProgram,
  onUpdate,
}: EditAdmissionProgramFormProps) => {
  const [form] = Form.useForm();

  const [selectedAdmissionProgram, setSelectedAdmissionProgram] = useState<
    number[]
  >([]);

  useEffect(() => {
    if (admissionProgram) {
      form.setFieldsValue({
        name: admissionProgram.data.name,
        description: admissionProgram.data.description,
        period: [
          moment(admissionProgram.data.startDate),
          moment(admissionProgram.data.endDate),
        ],
        startRegister: moment(admissionProgram.data.startRegistration),
        endRegister: moment(admissionProgram.data.endRegistration),
        quota: admissionProgram.data.quota,
        applicationDocuments: admissionProgram.data.applicationDocuments.map(
          (document) => document.id,
        ),
      });

      setSelectedAdmissionProgram(
        admissionProgram.data.applicationDocuments.map(
          (document) => document.id,
        ),
      );
    }
  }, [admissionProgram, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (admissionProgram) {
        const { period, ...rest } = values;
        const updatedAdmissionProgram: Partial<AdmissionProgram> = {
          ...rest,
          startDate: period[0].format("YYYY-MM-DD"),
          endDate: period[1].format("YYYY-MM-DD"),
          startRegistration: period[0].format("YYYY-MM-DD"),
          endRegistration: period[1].format("YYYY-MM-DD"),
          applicationDocuments: selectedAdmissionProgram.map((id) => ({
            id,
          })),
        };

        await admissionService.update(
          admissionProgram.data.id,
          updatedAdmissionProgram,
        );
        hideModal();
        onUpdate();
        notification.success({
          message: "Cập nhật chương trình tuyển sinh thành công",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi khi cập nhật chương trình tuyển sinh",
      });
    }
  };

  return (
    <Modal
      title="Chỉnh sửa chương trình tuyển sinh"
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
          name="startRegister"
          label="Thời gian đăng ký"
          rules={[{ required: true }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="endRegister"
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
      </Form>
    </Modal>
  );
};

export default EditAdmissionProgramForm;
