import { Modal, Form, Select, Input } from "antd";

interface ResitRequestModalProps {
  isVisible: boolean;
  editStatus: string;
  editNote: string;
  onOk: () => void;
  onCancel: () => void;
  onStatusChange: (value: string) => void;
  onNoteChange: (value: string) => void;
}

export const ResitRequestModal = ({
  isVisible,
  editStatus,
  editNote,
  onOk,
  onCancel,
  onStatusChange,
  onNoteChange,
}: ResitRequestModalProps) => {
  return (
    <Modal
      title="Cập nhật đơn đăng ký học lại"
      open={isVisible}
      onOk={onOk}
      onCancel={onCancel}
      okText="Cập nhật"
      cancelText="Hủy"
    >
      <Form layout="vertical">
        <Form.Item label="Trạng thái">
          <Select
            value={editStatus}
            onChange={onStatusChange}
            style={{ width: "100%" }}
          >
            <Select.Option value="PENDING">Đang chờ duyệt</Select.Option>
            <Select.Option value="APPROVED">Đã duyệt</Select.Option>
            <Select.Option value="REJECTED">Từ chối</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Ghi chú">
          <Input.TextArea
            value={editNote}
            onChange={(e) => onNoteChange(e.target.value)}
            rows={4}
            placeholder="Nhập ghi chú..."
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
