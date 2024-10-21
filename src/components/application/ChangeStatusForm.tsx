import { Form, Modal, notification, Radio } from "antd";
import applicationService from "../../services/application-service/application.service";
import { useState } from "react";

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

  const handleOk = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    Modal.confirm({
      title: "Xác nhận thay đổi trạng thái",
      content: "Bạn có chắc chắn muốn thay đổi trạng thái không?",
      okType: "danger",
      onOk: async () => {
        try {
          const values = await form.validateFields();
          const status = values.status;

          if (selectedIds.length === 1) {
            await applicationService.changeStatus(selectedIds[0], status);
          } else if (selectedIds.length > 1) {
            await applicationService.changeStatusMultiple(selectedIds, status);
          }

          notification.success({
            message: "Thay đổi trạng thái thành công!",
          });
          hideModal();
          onStatusChanged();
          form.resetFields();
        } catch (error) {
          console.error(error);
          notification.error({
            message: "Đã xảy ra lỗi khi thay đổi trạng thái!",
          });
        } finally {
          setIsSubmitting(false);
        }
      },
    });
  };

  return (
    <Modal
      title="Chuyển trạng thái"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={hideModal}
      okText="Xác nhận"
      cancelText="Đóng"
      centered
    >
      <Form form={form} layout="vertical">
        <Form.Item name="status" label="Trạng thái">
          <Radio.Group>
            {[
              "Chờ tiếp nhận",
              "Điện ưu tiên",
              "Hồ sơ đạt tiêu chí",
              "Không đạt tiêu chí",
            ].map((status, index) => (
              <Radio
                key={index}
                value={status}
                style={{ display: "block", margin: "15px 0" }}
              >
                {status}
              </Radio>
            ))}

            <div style={{ fontSize: "13px", fontWeight: "bold" }}>
              Đã xét tuyển
            </div>

            {["Trúng tuyển", "Không trúng tuyển", "Nhập học"].map(
              (status, index) => (
                <Radio
                  key={index}
                  value={status}
                  style={{ display: "block", margin: "15px 0" }}
                >
                  {status}
                </Radio>
              ),
            )}
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangeStatusForm;
