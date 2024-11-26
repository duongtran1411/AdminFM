import React from "react";
import { Modal, Form, Select, notification } from "antd";
import examScheduleMasterService from "../../services/exam-service/exam.schedule.master.service";

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const CreateExamScheduleForm: React.FC<Props> = ({
  visible,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await examScheduleMasterService.create(values);
      notification.success({ message: "Tạo lịch thi thành công" });
      form.resetFields();
      onSuccess();
    } catch (error) {
      notification.error({ message: "Lỗi khi tạo lịch thi" });
    }
  };

  return (
    <Modal
      title="Tạo lịch thi mới"
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="module_id"
          label="Môn thi"
          rules={[{ required: true, message: "Vui lòng chọn môn thi" }]}
        >
          <Select placeholder="Chọn môn thi"></Select>
        </Form.Item>

        <Form.Item
          name="exam_type_id"
          label="Loại thi"
          rules={[{ required: true, message: "Vui lòng chọn loại thi" }]}
        >
          <Select placeholder="Chọn loại thi">
            {/* Add exam type options */}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateExamScheduleForm;
