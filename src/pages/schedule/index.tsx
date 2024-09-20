import { EllipsisOutlined } from "@ant-design/icons";
import {
  Alert,
  Dropdown,
  Layout,
  Modal,
  notification,
  Spin,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ActionButtons from "../../components/schedule/ActionButton";
import ScheduleTabsMenu from "../../components/schedule/TabsMenu";
import UpdateScheduleForm from "../../components/schedule/UpdateScheduleForm";
import useModals from "../../hooks/useModal"; // Import hook
import {
  CreateScheduleData,
  ScheduleData,
  scheduleService,
} from "../../services/schedule-service/schedule.service";
import StudentPage from "../student";
import CreateScheduleForm from "../../components/schedule/CreateScheduleForm";

const ScheduleList: React.FC = () => {
  const { isVisible, showModal, hideModal } = useModals(); // Khai báo hook
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("1");
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleData>();
  const { classId } = useParams<{ classId: string }>();

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
    setSelectedSchedule(schedule);
    showModal("editSchedule");
  };

  const handleDelete = async (schedule: ScheduleData) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa lịch này?",
      okText: "Xóa",
      okType: "danger",
      onOk: async () => {
        try {
          // await scheduleService.remove(schedule.id);
          console.log(schedule);
          setSchedules(schedules.filter((s) => s.id !== schedule.id));
          notification.success({ message: "Xóa lịch thành công!" });
        } catch (error) {
          notification.error({ message: "Xóa lịch thất bại!" });
        }
      },
    });
  };

  const onSubmit = async (values: CreateScheduleData) => {
    try {
      if (selectedSchedule) {
        await scheduleService.update(selectedSchedule.id, values);
        notification.success({ message: "Cập nhật lịch thành công!" });
      } else {
        await scheduleService.create(values);
        notification.success({ message: "Thêm mới lịch thành công!" });
      }
      fetchSchedules();
      hideModal("editSchedule");
    } catch (error) {
      console.error("Error submitting schedule:", error);
      notification.error({ message: "Có lỗi xảy ra! Vui lòng thử lại." });
    }
  };

  const handleAddSchedule = () => {
    showModal("createSchedule");
  };

  const menu = (schedule: ScheduleData) => ({
    items: [
      {
        key: "1",
        label: <span onClick={() => handleEdit(schedule)}>Sửa</span>,
      },
      {
        key: "2",
        label: <span onClick={() => handleDelete(schedule)}>Xóa</span>,
      },
    ],
  });
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
        <Dropdown menu={menu(schedule)}>
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
          <ActionButtons onNewClick={handleAddSchedule} />
          <div style={{ marginTop: "60px" }}>
            <Table columns={columns} dataSource={schedules} rowKey="id" />
          </div>
        </Layout>
      ) : (
        <StudentPage />
      )}
      {/* Modal cho form tạo hoặc chỉnh sửa lịch học */}
      <UpdateScheduleForm
        initialValues={selectedSchedule}
        onSubmit={onSubmit}
        isModalVisible={isVisible("editSchedule")}
        hideModal={() => hideModal("editSchedule")}
      />
      <CreateScheduleForm
        isModalVisible={isVisible("createSchedule")}
        hideModal={() => hideModal("createSchedule")}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default ScheduleList;
