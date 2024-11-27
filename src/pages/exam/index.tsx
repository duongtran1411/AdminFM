import {
  CalendarOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Modal,
  notification,
  Table,
  Tabs,
  Tag,
  Tooltip,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import CreateExamScheduleForm from "../../components/exam/CreateExamScheduleForm";
import EditExamScheduleForm from "../../components/exam/EditExamScheduleForm";
import ExamRoomList from "../../components/exam/ExamRoomList";
import {
  ExamScheduleMaster,
  UpdateExamScheduleMaster,
} from "../../models/exam.model";
import examScheduleMasterService from "../../services/exam-service/exam.schedule.master.service";

const ExamManagement: React.FC = () => {
  const [examSchedules, setExamSchedules] = useState<ExamScheduleMaster[]>([]);
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedScheduleForEdit, setSelectedScheduleForEdit] =
    useState<UpdateExamScheduleMaster | null>(null);
  const [activeTab, setActiveTab] = useState("schedules");
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const scheduleResponse = await examScheduleMasterService.getAll();
      setExamSchedules(scheduleResponse.data);
    } catch (error) {
      notification.error({ message: "Lỗi khi tải dữ liệu" });
    }
  };

  const handleEdit = async (record: UpdateExamScheduleMaster) => {
    setSelectedScheduleForEdit(record);
    setIsEditModalVisible(true);
  };

  const scheduleColumns = [
    {
      title: "Mã môn",
      dataIndex: ["module", "code"],
      key: "module",
      render: (code: string, record: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>{code}</div>
          <div style={{ fontSize: "0.85em", color: "#666" }}>
            {record.module.name}
          </div>
        </div>
      ),
    },
    {
      title: "Môn thi",
      dataIndex: ["module", "module_name"],
      key: "module",
      render: (module_name: string, record: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>{module_name}</div>
          <div style={{ fontSize: "0.85em", color: "#666" }}>
            {record.module.name}
          </div>
        </div>
      ),
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Final Exam",
      key: "exam_date",
      width: 250,
      render: (_: any, record: any) => {
        const date = moment(record.exam_date).format("DD/MM/YYYY");
        const startTime = moment(record.start_time, "HH:mm:ss").format("HH:mm");
        const endTime = moment(record.end_time, "HH:mm:ss").format("HH:mm");
        return (
          <div
            style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <CalendarOutlined style={{ color: "#1890ff" }} />
              <span>{date}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <ClockCircleOutlined style={{ color: "#52c41a" }} />
              <span>
                {startTime} - {endTime}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: "Retake Exam",
      key: "retake_date",
      width: 250,
      render: (_: any, record: any) => {
        const date = moment(record.retake_date).format("DD/MM/YYYY");
        const startTime = moment(record.retake_start_time, "HH:mm:ss").format(
          "HH:mm",
        );
        const endTime = moment(record.retake_end_time, "HH:mm:ss").format(
          "HH:mm",
        );
        return (
          <div
            style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <CalendarOutlined style={{ color: "#1890ff" }} />
              <span>{date}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <ClockCircleOutlined style={{ color: "#52c41a" }} />
              <span>
                {startTime} - {endTime}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: "Loại thi",
      dataIndex: ["exam_type", "name"],
      key: "examType",
      render: (name: string) => <Tag>{name}</Tag>,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record: ExamScheduleMaster) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined style={{ color: "#1890ff" }} />}
              onClick={async () => {
                const response = await examScheduleMasterService.getById(
                  record.id,
                );
                handleEdit(response.data);
              }}
            />
          </Tooltip>
          <Tooltip title="Xem phòng thi">
            <Button
              icon={<EyeOutlined style={{ color: "#00b96b" }} />}
              onClick={() => handleViewRooms(record.id ?? -1)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
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

  const getTabs = () => {
    const tabs = [
      {
        label: (
          <span style={{ fontSize: "16px", padding: "0 8px" }}>
            <CalendarOutlined /> Lịch thi
          </span>
        ),
        key: "schedules",
        children: (
          <div style={{ position: "relative" }}>
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
                onClick={() => setIsScheduleModalVisible(true)}
              >
                Tạo lịch thi mới
              </Button>
            </div>
            <Table
              columns={scheduleColumns}
              dataSource={examSchedules}
              rowKey="id"
            />
          </div>
        ),
      },
    ];

    if (selectedExamId !== null) {
      tabs.push({
        label: (
          <span style={{ fontSize: "16px", padding: "0 8px" }}>Phòng thi</span>
        ),
        key: "rooms",
        children: <ExamRoomList examScheduleId={selectedExamId} />,
      });
    }

    return tabs;
  };

  const handleViewRooms = (id: number) => {
    setSelectedExamId(id);
    setActiveTab("rooms");
  };

  const handleTabChange = (key: string) => {
    if (key === "schedules") {
      setSelectedExamId(null);
    }
    setActiveTab(key);
  };

  const handleDelete = async (id: number | undefined) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa lịch thi này?",
      okText: "Xóa",
      okType: "danger",
      onOk: async () => {
        await examScheduleMasterService.remove(id);
        if (examSchedules) {
          const updatedExamSchedules = examSchedules.filter((p) => p.id !== id);
          setExamSchedules(updatedExamSchedules);
        }
        notification.success({
          message: "Lịch thi đã được xóa thành công",
        });
      },
    });
  };

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          type="card"
          items={getTabs()}
        />
      </Card>

      <CreateExamScheduleForm
        visible={isScheduleModalVisible}
        onCancel={() => setIsScheduleModalVisible(false)}
        onSuccess={() => {
          setIsScheduleModalVisible(false);
          fetchData();
        }}
      />
      {selectedScheduleForEdit && (
        <EditExamScheduleForm
          visible={isEditModalVisible}
          initialData={selectedScheduleForEdit}
          onCancel={() => {
            setIsEditModalVisible(false);
            setSelectedScheduleForEdit(null);
          }}
          onSuccess={() => {
            setIsEditModalVisible(false);
            setSelectedScheduleForEdit(null);
            fetchData();
          }}
        />
      )}
    </div>
  );
};

export default ExamManagement;
