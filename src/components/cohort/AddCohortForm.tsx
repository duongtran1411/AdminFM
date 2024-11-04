import { DatePicker, Form, Input, Modal, notification } from "antd";
import { Cohort } from "../../models/cohort.model";
import cohortService from "../../services/cohort-service/cohort.service";

interface Props {
  isModalVisible: boolean;
  hideModal: () => void;
  onCohortCreated: () => void;
}

const AddCohortForm = ({
  isModalVisible,
  hideModal,
  onCohortCreated,
}: Props) => {
  const [form] = Form.useForm();

  // Xử lý khi nhấn nút "OK"
  const handleOk = async () => {
    const values = await form.validateFields();
    const newCohort: Cohort = {
      ...values,
    };
    await cohortService.addCohort(newCohort);
    onCohortCreated();
    notification.success({ message: "Cohort created successfully!" });
    form.resetFields();
    hideModal();
  };

  return (
    <Modal
      title="Tạo mới niên khóa"
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
          label="Tên niên khóa"
          rules={[
            { required: true, message: "Please input the cohort's name!" },
          ]}
        >
          <Input placeholder="Enter cohort's name" />
        </Form.Item>
        <Form.Item name="startDate" label="Ngày bắt đầu">
          <DatePicker />
        </Form.Item>
        <Form.Item name="endDate" label="Ngày kết thúc">
          <DatePicker />
        </Form.Item>
        <Form.Item name="status" label="Trạng thái">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCohortForm;
