import { Modal, Table, Tag, Input, Select, notification, Button } from "antd";
import React, { useState } from "react";
import { ExamRoomStudent } from "../../models/exam.model";
import examRoomService from "../../services/exam-service/exam.room.service";

interface ViewStudentsModalProps {
  visible: boolean;
  onCancel: () => void;
  examRoomStudents: ExamRoomStudent[];
  examRoomId: number;
  onSuccess: () => void;
}

const ViewStudentsModal: React.FC<ViewStudentsModalProps> = ({
  visible,
  onCancel,
  examRoomStudents,
  examRoomId,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [localStudents, setLocalStudents] = useState<ExamRoomStudent[]>([]);

  // Khởi tạo dữ liệu local khi modal mở
  React.useEffect(() => {
    if (visible) {
      setLocalStudents(examRoomStudents);
    }
  }, [visible, examRoomStudents]);

  const handleUpdateLocalData = (
    studentId: number,
    updates: Partial<ExamRoomStudent>,
  ) => {
    setLocalStudents((prev) =>
      prev.map((student) =>
        student.student?.id === studentId
          ? { ...student, ...updates }
          : student,
      ),
    );
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Lọc những student có thay đổi
      const updatePromises = localStudents.map((student) =>
        examRoomService.updateStudentPresence(
          examRoomId,
          student.student?.id || 0,
          {
            is_present: student.is_present,
            note: student.note,
          },
        ),
      );

      await Promise.all(updatePromises);
      notification.success({ message: "Cập nhật điểm danh thành công" });
      onSuccess();
    } catch (error) {
      notification.error({ message: "Cập nhật điểm danh thất bại" });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Mã SV",
      dataIndex: ["student", "studentId"],
      key: "studentId",
      render: (studentId: string | null) => <Tag>{studentId || "N/A"}</Tag>,
    },
    {
      title: "Họ và tên",
      dataIndex: ["student", "name"],
      key: "name",
    },
    {
      title: "Điểm danh",
      dataIndex: "is_present",
      key: "is_present",
      render: (isPresent: boolean | null, record: ExamRoomStudent) => (
        <Select
          style={{ width: 120 }}
          value={isPresent}
          placeholder="Điểm danh"
          onChange={(value) =>
            handleUpdateLocalData(record.student?.id || 0, {
              is_present: value,
            })
          }
          options={[
            {
              value: true,
              label: <span style={{ color: "#1890ff" }}>Có mặt</span>,
            },
            {
              value: false,
              label: <span style={{ color: "#ff4d4f" }}>Vắng mặt</span>,
            },
          ]}
        />
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (_: string, record: ExamRoomStudent) => (
        <Input.TextArea
          value={record.note || ""}
          autoSize
          onChange={(e) =>
            handleUpdateLocalData(record.student?.id || 0, {
              note: e.target.value,
            })
          }
        />
      ),
    },
  ];

  return (
    <Modal
      title="Danh sách thí sinh trong phòng thi"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Huỷ
        </Button>,
        <Button
          key="save"
          type="primary"
          loading={loading}
          onClick={handleSave}
        >
          Lưu
        </Button>,
      ]}
      width={800}
    >
      <Table
        columns={columns}
        dataSource={localStudents}
        rowKey={(record) => record.student?.id || 0}
        pagination={{ pageSize: 10 }}
        loading={loading}
      />
    </Modal>
  );
};

export default ViewStudentsModal;
