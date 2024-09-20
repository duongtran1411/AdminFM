import { EllipsisOutlined } from "@ant-design/icons";
import { Alert, Dropdown, Layout, Menu, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ScheduleTabsMenu from "../../components/schedule/TabsMenu";
import {
  ScheduleData,
  scheduleService,
} from "../../services/schedule-service/schedule.service";
import StudentPage from "../student";

const ScheduleList: React.FC = () => {
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("1");
  const { classId } = useParams<{ classId: string }>();

  // Fetch schedules
  const fetchSchedules = async () => {
    try {
      const data = await scheduleService.findByClassId(classId!);
      setSchedules(data);
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setError("Failed to load schedules.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleEdit = (schedule: ScheduleData) => {
    console.log("Edit");
  };

  const handleDelete = async (schedule: ScheduleData) => {
    console.log("Edit");
  };

  const menu = (schedule: ScheduleData) => (
    <Menu>
      <Menu.Item key="1" onClick={() => handleEdit(schedule)}>
        Sửa
      </Menu.Item>
      <Menu.Item key="2" onClick={() => handleDelete(schedule)}>
        Xóa
      </Menu.Item>
    </Menu>
  );
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Tên Lớp",
      dataIndex: ["class", "name"],
      key: "name",
    },
    {
      title: "Tên Ca",
      dataIndex: ["shift", "name"],
      key: "shiftName",
    },
    {
      title: "Thời Gian Bắt Đầu Ca",
      dataIndex: ["shift", "startTime"],
      key: "shiftStartTime",
    },
    {
      title: "Thời Gian Kết Thúc Ca",
      dataIndex: ["shift", "endTime"],
      key: "shiftEndTime",
    },
    {
      title: "Tên Phòng Học",
      dataIndex: ["classroom", "name"],
      key: "classroomName",
    },
    {
      title: "Giảng Viên",
      dataIndex: ["teacher", "name"],
      key: "username",
    },
    {
      title: "Môn học",
      dataIndex: ["module", "module_name"],
      key: "module_name",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, schedule: ScheduleData) => (
        <Dropdown overlay={menu(schedule)}>
          <EllipsisOutlined style={{ fontSize: "24px", cursor: "pointer" }} />
        </Dropdown>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", paddingTop: "20px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message={error} type="error" showIcon />;
  }

  return (
    <div>
      <ScheduleTabsMenu onTabChange={setActiveTab} />
      {activeTab === "1" ? (
        <Layout
          className="rounded-lg"
          style={{
            background: "white",
            padding: "20px",
            minHeight: "100vh",
            position: "relative",
          }}
        >
          <div style={{ marginTop: "60px" }}>
            <Table columns={columns} dataSource={schedules} rowKey="id" />
          </div>
        </Layout>
      ) : (
        <StudentPage />
      )}
    </div>
  );
};

export default ScheduleList;
