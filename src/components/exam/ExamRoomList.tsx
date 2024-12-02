import { Button, Table, Tooltip, notification } from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  PlusCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { ExamRoom } from "../../models/exam.model";
import examRoomService from "../../services/exam-service/exam.room.service";
import CreateExamRoomModal from "./CreateExamRoomModal";
import AddStudentsModal from "./AddStudentModal";
import ViewStudentsModal from "./ViewStudentModal";

interface ExamRoomListProps {
  examScheduleId: number | null;
  moduleId?: number;
}

const ExamRoomList: React.FC<ExamRoomListProps> = ({
  examScheduleId,
  moduleId,
}) => {
  const [examRooms, setExamRooms] = useState<ExamRoom[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddStudentsModalVisible, setIsAddStudentsModalVisible] =
    useState(false);
  const [selectedRoom, setSelectedRoom] = useState<ExamRoom | null>(null);
  const [isViewStudentsModalVisible, setIsViewStudentsModalVisible] =
    useState(false);

  useEffect(() => {
    if (examScheduleId) {
      fetchRooms(examScheduleId);
    }
  }, [examScheduleId]);

  const fetchRooms = async (id: number) => {
    try {
      const response = await examRoomService.findByExamScheduleMasterId(id);
      setExamRooms(response.data);
    } catch (error) {
      notification.error({ message: "Lỗi khi tải danh sách phòng thi" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await examRoomService.remove(id);
      notification.success({ message: "Xóa phòng thi thành công" });
      if (examScheduleId) {
        fetchRooms(examScheduleId);
      }
    } catch (error) {
      notification.error({ message: "Lỗi khi xóa phòng thi" });
    }
  };

  const handleAddStudentsSuccess = () => {
    setIsAddStudentsModalVisible(false);
    setSelectedRoom(null);
    if (examScheduleId) {
      fetchRooms(examScheduleId);
    }
  };

  const handleViewStudentsSuccess = () => {
    if (examScheduleId) {
      fetchRooms(examScheduleId);
    }
  };

  const roomColumns = [
    {
      title: "Phòng",
      dataIndex: ["classroom", "name"],
      key: "classroom",
    },
    {
      title: "Giám thị",
      dataIndex: ["teacher", "name"],
      key: "teacher",
    },
    {
      title: "Số lượng thí sinh",
      dataIndex: "capacity",
      key: "capacity",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Tooltip title="Xem danh sách thí sinh">
            <Button
              icon={<EyeOutlined style={{ color: "#00b96b" }} />}
              onClick={() => {
                setSelectedRoom(record);
                setIsViewStudentsModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Thêm thí sinh">
            <Button
              icon={<PlusCircleOutlined style={{ color: "#1890ff" }} />}
              onClick={() => {
                setSelectedRoom(record);
                setIsAddStudentsModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa phòng thi">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleCreateSuccess = () => {
    setIsModalVisible(false);
    if (examScheduleId) {
      fetchRooms(examScheduleId);
    }
  };

  if (!examScheduleId) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>
        Vui lòng chọn một lịch thi để xem danh sách phòng thi
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          position: "absolute",
          right: 0,
          top: -48,
          zIndex: 1,
        }}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          Thêm phòng thi
        </Button>
      </div>
      <Table columns={roomColumns} dataSource={examRooms} rowKey="id" />

      {examScheduleId && (
        <CreateExamRoomModal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onSuccess={handleCreateSuccess}
          examScheduleId={examScheduleId}
        />
      )}

      {selectedRoom && (
        <AddStudentsModal
          visible={isAddStudentsModalVisible}
          onCancel={() => {
            setIsAddStudentsModalVisible(false);
            setSelectedRoom(null);
          }}
          onSuccess={handleAddStudentsSuccess}
          examRoomId={selectedRoom.id}
          capacity={selectedRoom.capacity || 0}
          currentStudentCount={selectedRoom.exam_room_students?.length || 0}
          moduleId={moduleId || 0}
        />
      )}

      {selectedRoom && (
        <ViewStudentsModal
          visible={isViewStudentsModalVisible}
          onCancel={() => {
            setIsViewStudentsModalVisible(false);
            setSelectedRoom(null);
          }}
          onSuccess={handleViewStudentsSuccess}
          examRoomStudents={selectedRoom.exam_room_students || []}
          examRoomId={selectedRoom.id}
        />
      )}
    </>
  );
};

export default ExamRoomList;
