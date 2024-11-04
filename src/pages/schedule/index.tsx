import { Alert, DatePicker, Empty, Layout, Modal, notification } from "antd";
import dayjs, { Dayjs } from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import weekday from "dayjs/plugin/weekday";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../components/common/loading";
import ActionButtons from "../../components/schedule/ActionButton";
import CreateScheduleAutoForm from "../../components/schedule/CreateScheduleAutoForm";
import CreateScheduleForm from "../../components/schedule/CreateScheduleForm";
import ScheduleTabsMenu from "../../components/schedule/TabsMenu";
import Timetable from "../../components/schedule/TimeTable";
import UpdateScheduleForm from "../../components/schedule/UpdateScheduleForm";
import NavigateBack from "../../components/shared/NavigateBack";
import useModals from "../../hooks/useModal";
import classService from "../../services/class-service/class.service";
import {
  CreateScheduleData,
  ScheduleData,
  scheduleService,
} from "../../services/schedule-service/schedule.service";
import StudentInClassPage from "../student/StudentInClass";

dayjs.extend(weekday);
dayjs.extend(isoWeek);

const ScheduleList: React.FC = () => {
  const { isVisible, showModal, hideModal } = useModals();
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [scheduleInClass, setScheduleInClass] = useState<ScheduleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("1");
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleData>();
  const { classId } = useParams<{ classId: string }>();
  const [className, setClassName] = useState<string | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<
    [Dayjs, Dayjs] | null
  >([dayjs().startOf("isoWeek"), dayjs().endOf("isoWeek")]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchClassName();
      await fetchSchedules();
      await fetchSchedulesInClass();
    };
    fetchData();
  }, [selectedDateRange, classId]);

  const fetchSchedulesInClass = async () => {
    try {
      const data = await scheduleService.findByClassId(classId!);
      setScheduleInClass(data);
    } catch (err) {
      console.error("Error fetching schedules in class:", err);
    }
  };

  const fetchClassName = async () => {
    try {
      const { data } = await classService.getClassById(+classId!);
      setClassName(data.name);
    } catch (err) {
      console.error("Error fetching class name:", err);
    }
  };

  const fetchSchedules = async () => {
    if (!selectedDateRange) return;
    setLoading(true);
    try {
      const [startDate, endDate] = selectedDateRange;
      const data = await scheduleService.findSchedulesByClassAndDateRange(
        +classId!,
        startDate.format("YYYY-MM-DD"),
        endDate.format("YYYY-MM-DD"),
      );
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

  const onSubmitAutoSchedule = async () => {
    try {
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
    showModal(schedules.length === 0 ? "createScheduleAuto" : "createSchedule");
  };

  const handleDateChange = (dates: (Dayjs | null)[] | null) => {
    if (dates && dates[0]) {
      const startOfWeek = dates[0].startOf("isoWeek");
      setSelectedDateRange([startOfWeek, startOfWeek.add(6, "day")]);
    } else {
      setSelectedDateRange(null);
    }
  };

  const disabledDate = (current: Dayjs) => current.day() !== 1;

  if (loading) return <Loading />;
  if (error) return <Alert message={error} type="error" showIcon />;

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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <NavigateBack />
            <ActionButtons
              onNewClick={handleAddSchedule}
              isEmpty={schedules.length === 0}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <DatePicker.RangePicker
              value={selectedDateRange}
              onChange={handleDateChange}
              disabledDate={disabledDate}
              style={{ width: 300 }}
            />
          </div>

          {scheduleInClass.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Empty
                description={
                  <>
                    Chưa có lịch học cho lớp{" "}
                    <strong>
                      <em>{className || ""}</em>
                    </strong>
                  </>
                }
              />
            </div>
          ) : (
            <Timetable
              scheduleData={schedules}
              onDelete={handleDelete}
              onEdit={handleEdit}
              selectedDateRange={selectedDateRange}
            />
          )}
        </Layout>
      ) : (
        <StudentInClassPage />
      )}
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
