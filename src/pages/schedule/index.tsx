import { EllipsisOutlined } from "@ant-design/icons";
import { Alert, Dropdown, Layout, Modal, notification, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/common/loading";
import ActionButtons from "../../components/schedule/ActionButton";
import CreateScheduleAutoForm from "../../components/schedule/CreateScheduleAutoForm";
import CreateScheduleForm from "../../components/schedule/CreateScheduleForm";
import ScheduleTabsMenu from "../../components/schedule/TabsMenu";
import UpdateScheduleForm from "../../components/schedule/UpdateScheduleForm";
import useModals from "../../hooks/useModal";
import {
  CreateScheduleData,
  ScheduleData,
  scheduleService,
} from "../../services/schedule-service/schedule.service";
import StudentInClassPage from "../student/StudentInClass";

const ScheduleList: React.FC = () => {
  const navigate = useNavigate();
  const { isVisible, showModal, hideModal } = useModals();
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("1");
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleData>();
  const { classId } = useParams<{ classId: string }>();

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
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
          await scheduleService.delete(schedule.id);
          setSchedules(schedules.filter((s) => s.id !== schedule.id));
          notification.success({ message: "Xóa lịch thành công!" });
        } catch (error) {
          notification.error({ message: "Xóa lịch thất bại!" });
        }
      },
    });
  };
  const onSubmitAutoSchedule = async (values: any) => {
    try {
      console.log(values);
      await fetchSchedules();
      notification.success({ message: "Tạo lịch học tự động thành công!" });
      hideModal("createScheduleAuto");
    } catch (error) {
      console.error("Error submitting auto schedule:", error);
      notification.error({
        message: "Có lỗi xảy ra khi tạo lịch học tự động. Vui lòng thử lại.",
      });
    }
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
    if (schedules.length === 0) {
      showModal("createScheduleAuto");
    } else {
      showModal("createSchedule");
    }
  };
  const handleRowClick = (schedule: ScheduleData) => {
    navigate(`/schedule/attendance/${schedule.id}`);
  };

  const menu = (schedule: ScheduleData) => ({
    items: [
      {
        key: "1",
        label: (
          <span
            onClick={() => {
              // e.stopPropagation();
              handleEdit(schedule);
            }}
          >
            Sửa
          </span>
        ),
      },
      {
        key: "2",
        label: (
          <span
            onClick={() => {
              // e.stopPropagation();
              handleDelete(schedule);
            }}
          >
            Xóa
          </span>
        ),
      },
    ],
  });

  const columns = [
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
        <div onClick={(e) => e.stopPropagation()}>
          <Dropdown menu={menu(schedule)} trigger={["click"]}>
            <EllipsisOutlined
              style={{ padding: "10px", fontSize: "24px", cursor: "pointer" }}
            />
          </Dropdown>
        </div>
      ),
    },
  ];

  if (loading) {
    return <Loading />;
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
          <ActionButtons
            onNewClick={handleAddSchedule}
            isEmpty={schedules.length === 0}
          />
          <div style={{ marginTop: "20px" }}>
            <Table
              columns={columns}
              dataSource={schedules}
              rowKey="id"
              onRow={(schedule) => ({
                onClick: () => handleRowClick(schedule),
              })}
            />
          </div>
        </Layout>
      ) : (
        <StudentInClassPage />
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
      <CreateScheduleAutoForm
        isModalVisible={isVisible("createScheduleAuto")}
        hideModal={() => hideModal("createScheduleAuto")}
        onSubmit={onSubmitAutoSchedule}
      />
    </div>
  );
};

export default ScheduleList;
