import { Form, Modal, notification, Radio, Select } from "antd";
import { useEffect, useState } from "react";
import applicationService from "../../services/application-service/application.service";
import cohortService from "../../services/cohort-service/cohort.service";
import { ApplicationStatus } from "../../models/enum/application.status.enum";
import { Cohort } from "../../models/cohort.model";

interface Props {
  isModalVisible: boolean;
  hideModal: () => void;
  onStatusChanged: () => void;
  selectedIds: number[];
}

const ChangeStatusForm = ({
  isModalVisible,
  hideModal,
  onStatusChanged,
  selectedIds,
}: Props) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const response = await cohortService.getAllCohort();
        setCohorts(response.data);
      } catch (error) {
        console.error("Failed to fetch cohorts:", error);
        notification.error({ message: "Không thể tải danh sách Cohort" });
      }
    };
    fetchCohorts();
  }, []);

  const handleStatusChange = (e: any) => setSelectedStatus(e.target.value);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const values = await form.validateFields();
      const { status, cohort } = values;

      if (selectedIds.length === 1) {
        await applicationService.changeStatus(selectedIds[0], status, cohort);
      } else if (selectedIds.length > 1) {
        await applicationService.changeStatusMultiple(
          selectedIds,
          status,
          cohort,
        );
      }
      notification.success({ message: "Thay đổi trạng thái thành công!" });
      hideModal();
      onStatusChanged();
      form.resetFields();
    } catch (error) {
      console.error("Error changing status:", error);
      notification.error({ message: "Đã xảy ra lỗi khi thay đổi trạng thái!" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title="Chuyển trạng thái"
      open={isModalVisible}
      onOk={() =>
        Modal.confirm({
          title: "Xác nhận thay đổi trạng thái",
          content: "Bạn có chắc chắn muốn thay đổi trạng thái không?",
          okType: "danger",
          onOk: handleSubmit,
        })
      }
      onCancel={hideModal}
      okText="Xác nhận"
      cancelText="Đóng"
      centered
    >
      <Form form={form} layout="vertical">
        <Form.Item name="status" label="Trạng thái">
          <Radio.Group onChange={handleStatusChange}>
            {[
              ApplicationStatus.WAITING,
              ApplicationStatus.PRIORITY,
              ApplicationStatus.MEETS_CRITERIA,
              ApplicationStatus.DOES_NOT_MEET_CRITERIA,
            ].map((status) => (
              <Radio
                key={status}
                value={status}
                style={{ display: "block", margin: "15px 0" }}
              >
                {status}
              </Radio>
            ))}
            <div style={{ fontSize: "13px", fontWeight: "bold" }}>
              Đã xét tuyển
            </div>
            {[
              ApplicationStatus.ACCEPTED,
              ApplicationStatus.NOT_ACCEPTED,
              ApplicationStatus.ENROLLED,
            ].map((status) => (
              <Radio
                key={status}
                value={status}
                style={{ display: "block", margin: "15px 0" }}
              >
                {status}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        {selectedStatus === ApplicationStatus.ENROLLED && (
          <Form.Item name="cohort" label="Niên khóa">
            <Select placeholder="Chọn Niên khóa">
              {cohorts.map((cohort) => (
                <Select.Option key={cohort.id} value={cohort.name}>
                  {cohort.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default ChangeStatusForm;
