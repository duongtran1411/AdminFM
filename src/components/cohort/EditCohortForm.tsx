import { DatePicker, Form, Input, Modal, notification } from "antd";
import { useEffect } from "react";
import { Cohort } from "../../models/cohort.model";
import buildingService from "../../services/building-service/building.service";
import dayjs from "dayjs";

interface EditCohortFormProps {
  isModalVisible: boolean;
  hideModal: () => void;
  cohort: Cohort | null;
  onUpdate: () => void;
}

const EditCohortForm = ({
  isModalVisible,
  hideModal,
  cohort,
  onUpdate,
}: EditCohortFormProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (cohort) {
      form.setFieldsValue({
        name: cohort.name,
        startDate: dayjs(cohort.startDate),
        endDate: dayjs(cohort.endDate),
        status: cohort.status,
      });
    }
  }, [cohort, form]);

  // Xử lý khi nhấn nút "OK"
  const handleOk = async () => {
    Modal.confirm({
      title: "Are you sure you want to update this Cohort?",
      okText: "Update",
      okType: "danger",
      onOk: async () => {
        try {
          const values = await form.validateFields();
          const updatedCohort = {
            ...cohort,
            ...values,
          };
          await buildingService.updateBuilding(updatedCohort.id, updatedCohort);
          form.resetFields();
          hideModal();
          onUpdate();
          notification.success({ message: "Cohort updated successfully" });
        } catch (error) {
          notification.error({ message: "Error updating Cohort" });
        }
      },
    });
  };

  return (
    <Modal
      title="Edit Cohort"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields(); // Reset các trường form khi đóng modal
        hideModal();
      }}
      okText="Update"
      cancelText="Cancel"
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

export default EditCohortForm;
