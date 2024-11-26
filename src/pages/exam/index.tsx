import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, notification, Space, Table, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import CreateExamScheduleForm from "../../components/exam/CreateExamScheduleForm";
import { ExamRoom, ExamScheduleMaster } from "../../models/exam.model";
import examRoomService from "../../services/exam-service/exam.room.service";
import examScheduleMasterService from "../../services/exam-service/exam.schedule.master.service";
import moment from "moment";

const ExamManagement: React.FC = () => {
  const [examSchedules, setExamSchedules] = useState<ExamScheduleMaster[]>([]);
  const [examRooms, setExamRooms] = useState<ExamRoom[]>([]);
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
  const [isRoomModalVisible, setIsRoomModalVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] =
    useState<ExamScheduleMaster | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const scheduleResponse = await examScheduleMasterService.getAll();
      console.log(scheduleResponse);
      const roomResponse = await examRoomService.getAll();
      setExamSchedules(scheduleResponse.data);
      setExamRooms(roomResponse.data);
    } catch (error) {
      notification.error({ message: "Lỗi khi tải dữ liệu" });
    }
  };

  const scheduleColumns = [
    {
      title: "Môn thi",
      dataIndex: ["module", "code"],
      key: "module",
    },
    {
      title: "Loại thi",
      dataIndex: ["exam_type", "name"],
      key: "examType",
    },
    {
      title: "Ngày thi",
      dataIndex: "exam_date",
      key: "exam_date",
      render: (date: string) => {
        return moment(date).format("DD/MM/YYYY");
      },
    },
    {
      title: "Thời gian thi",
      key: "exam_time",
      render: (_: any, record: any) => {
        const startTime = moment(record.start_time, "HH:mm:ss").format("HH:mm");
        const endTime = moment(record.end_time, "HH:mm:ss").format("HH:mm");
        return `${startTime} - ${endTime}`;
      },
    },
    {
      title: "Ngày thi lần 2",
      dataIndex: "retake_date",
      key: "retake_date",
      render: (date: string) => {
        return moment(date).format("DD/MM/YYYY");
      },
    },
    {
      title: "Thời gian thi lần 2",
      key: "retake_time",
      render: (_: any, record: any) => {
        const startTime = moment(record.retake_start_time, "HH:mm:ss").format(
          "HH:mm",
        );
        const endTime = moment(record.retake_end_time, "HH:mm:ss").format(
          "HH:mm",
        );
        return `${startTime} - ${endTime}`;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record: ExamScheduleMaster) => (
        <Button type="link" onClick={() => handleScheduleSelect(record)}>
          Quản lý phòng thi
        </Button>
      ),
    },
  ];

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
  ];

  const handleScheduleSelect = (schedule: ExamScheduleMaster) => {
    setSelectedSchedule(schedule);
  };

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <Tabs
          type="card"
          items={[
            {
              label: "Lịch thi",
              key: "schedules",
              children: (
                <>
                  <Space style={{ marginBottom: 16 }}>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => setIsScheduleModalVisible(true)}
                    >
                      Tạo lịch thi mới
                    </Button>
                  </Space>
                  <Table
                    columns={scheduleColumns}
                    dataSource={examSchedules}
                    rowKey="id"
                  />
                </>
              ),
            },
            {
              label: "Phòng thi",
              key: "rooms",
              children: (
                <>
                  {selectedSchedule && (
                    <>
                      <Space style={{ marginBottom: 16 }}>
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={() => setIsRoomModalVisible(true)}
                        >
                          Thêm phòng thi
                        </Button>
                      </Space>
                      <Table
                        columns={roomColumns}
                        dataSource={examRooms.filter(
                          (room) =>
                            room.exam_schedule_master_id ===
                            selectedSchedule.id,
                        )}
                        rowKey="id"
                      />
                    </>
                  )}
                </>
              ),
            },
          ]}
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
    </div>
  );
};

export default ExamManagement;
