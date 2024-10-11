import {
  Checkbox,
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
import { ApplicationDocument } from "../../models/applicationdocument.model";
import admissionService from "../../services/admission-service/admission.service";
import applicationDocumentsService from "../../services/application-documents-service/application.documents.service";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface EditAdmissionProgramFormProps {
  isModalVisible: boolean;
  hideModal: () => void;
  admissionProgram: AdmissionProgram | null;
  onUpdate: () => void;
}

const EditAdmissionProgramForm = ({
  isModalVisible,
  hideModal,
  admissionProgram,
  onUpdate,
}: EditAdmissionProgramFormProps) => {
  const [form] = Form.useForm();
  const [applicationDocuments, setApplicationDocuments] = useState<
    ApplicationDocument[]
  >([]);
  const [selectedAdmissionProgram, setSelectedAdmissionProgram] = useState<
    number[]
  >([]);

  useEffect(() => {
    if (admissionProgram) {
      console.log(admissionProgram);
      form.setFieldsValue({
        name: admissionProgram.name,
        description: admissionProgram.description,
        period: [
          moment(admissionProgram.startDate),
          moment(admissionProgram.endDate),
        ],
        startRegister: moment(admissionProgram.startRegister),
        endRegister: moment(admissionProgram.endRegister),
        quota: admissionProgram.quota,
      });
      
      // Đảm bảo rằng selectedAdmissionProgram được cập nhật sau khi admissionProgram thay đổi
      setSelectedAdmissionProgram(
        admissionProgram.applicationDocumentIds.map((document) => document.id)
      );
    }
  }, [admissionProgram, form]);

  useEffect(() => {
    const fetchApplicationDocuments = async () => {
      const response = await applicationDocumentsService.getAll();
      setApplicationDocuments(response.data);
      
      // Cập nhật lại selectedAdmissionProgram sau khi có dữ liệu mới
      if (admissionProgram) {
        setSelectedAdmissionProgram(prevSelected => 
          prevSelected.filter(id => response.data.some(doc => doc.id === id))
        );
      }
    };

    if (isModalVisible) {
      fetchApplicationDocuments();
    }
  }, [isModalVisible, admissionProgram]);

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
          admissionProgram.id,
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
  const handleChange = (checkedValues: number[]) => {
    setSelectedAdmissionProgram(checkedValues);
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
        <Form.Item
          name="applicationDocuments"
          label="Chọn thêm tài liệu đăng ký"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn ít nhất một tài liệu đăng ký!",
            },
          ]}
        >
          <Checkbox.Group
            value={selectedAdmissionProgram}
            onChange={handleChange}
            style={{ width: "100%" }}
          >
            {applicationDocuments.map((applicationDocument) => {
              console.log(applicationDocument.id);
              return (
                <Checkbox
                  key={applicationDocument.id}
                  value={applicationDocument.id}
                >
                  {applicationDocument.name}
                </Checkbox>
              );
            })}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditAdmissionProgramForm;
