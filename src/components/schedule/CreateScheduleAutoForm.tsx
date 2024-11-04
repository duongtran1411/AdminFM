import { Button, DatePicker, message, Modal, Select, Spin, Table } from "antd";
import { debounce } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Module } from "../../models/courses.model";
import { Shifts } from "../../models/shifts";
import classService from "../../services/class-service/class.service";
import { scheduleService } from "../../services/schedule-service/schedule.service";

const CreateScheduleAutoForm: React.FC<{
  isModalVisible: boolean;
  hideModal: () => void;
  onSubmit: (values: any) => void;
}> = ({ isModalVisible, hideModal, onSubmit }) => {
  const [shifts, setShifts] = useState<Shifts[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { classId } = useParams<{ classId: string }>();

  useEffect(() => {
    const fetchData = async () => {
      const [shiftsData, modulesData] = await Promise.all([
        scheduleService.getShifts(),
        classService.getModulesByCoursesFamilyOfClass(Number(classId!)),
      ]);
      setShifts(shiftsData);
      setModules(modulesData);

      const initialTableData = modulesData.map((module) => ({
        key: module.module_id.toString(),
        moduleId: module.module_id,
        selectedDays: [],
        availableClassrooms: [],
        availableTeachers: [],
        shiftIds: [], // Updated to an array for multiple selection
      }));
      setTableData(initialTableData);
    };

    fetchData();
  }, [classId]);

  const fetchAvailableData = debounce(async (record: any) => {
    if (
      record.startDate &&
      record.shiftIds.length > 0 &&
      record.selectedDays.length > 0
    ) {
      try {
        const selectedDaysString = JSON.stringify(record.selectedDays);
        const [classrooms, teachers] = await Promise.all([
          scheduleService.getAvailableClassrooms(
            record.moduleId,
            record.shiftIds, // Pass array of shift IDs
            record.startDate,
            selectedDaysString,
          ),
          scheduleService.getAvailableTeachers(
            record.moduleId,
            record.shiftIds, // Pass array of shift IDs
            record.startDate,
            selectedDaysString,
          ),
        ]);
        setTableData((prevData) =>
          prevData.map((item) =>
            item.key === record.key
              ? {
                  ...item,
                  availableClassrooms: classrooms,
                  availableTeachers: teachers,
                }
              : item,
          ),
        );
      } catch (error) {
        console.error("Error fetching available data:", error);
        message.error(
          "Không thể lấy danh sách phòng học và giảng viên khả dụng.",
        );
      }
    }
  }, 300);

  const handleTableChange = (key: string, dataIndex: string, value: any) => {
    setTableData((prevData) =>
      prevData.map((item) => {
        if (item.key === key) {
          const updatedItem = { ...item, [dataIndex]: value };
          if (["startDate", "shiftIds", "selectedDays"].includes(dataIndex)) {
            fetchAvailableData(updatedItem);
          }
          return updatedItem;
        }
        return item;
      }),
    );
  };

  const columns = [
    {
      title: "Môn học",
      dataIndex: "moduleId",
      key: "moduleId",
      render: (_: any, record: any) => {
        const module = modules.find((m) => m.module_id === record.moduleId);
        return module ? module.module_name : "N/A";
      },
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (_: any, record: any) => (
        <DatePicker
          value={record.startDate ? moment(record.startDate) : null}
          onChange={(_, dateString) =>
            handleTableChange(record.key, "startDate", dateString)
          }
          disabledDate={(current) => {
            return current && current < moment().endOf("day");
          }}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Ngày học",
      dataIndex: "selectedDays",
      key: "selectedDays",
      render: (_: any, record: any) => (
        <Select
          mode="multiple"
          value={record.selectedDays}
          onChange={(value) =>
            handleTableChange(record.key, "selectedDays", value)
          }
          style={{ width: "100%" }}
        >
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => (
            <Select.Option key={day} value={day}>
              {day}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Ca học",
      dataIndex: "shiftIds",
      key: "shiftIds",
      render: (_: any, record: any) => (
        <Select
          mode="multiple" // Enable multiple selection for shifts
          dropdownStyle={{ minWidth: "150px" }}
          value={record.shiftIds}
          onChange={(value) => handleTableChange(record.key, "shiftIds", value)}
          style={{ width: "100%" }}
        >
          {shifts.map((shift) => (
            <Select.Option key={shift.id} value={shift.id}>
              {shift.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Phòng học",
      dataIndex: "classroomId",
      key: "classroomId",
      render: (_: any, record: any) => (
        <Select
          showSearch
          dropdownStyle={{ minWidth: "150px" }}
          value={record.classroomId}
          onChange={(value) =>
            handleTableChange(record.key, "classroomId", value)
          }
          style={{ width: "100%" }}
        >
          {record.availableClassrooms.map((classroom) => (
            <Select.Option key={classroom.id} value={classroom.id}>
              {classroom.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Giảng viên",
      dataIndex: "teacherId",
      key: "teacherId",
      render: (_: any, record: any) => (
        <Select
          dropdownStyle={{ minWidth: "200px" }}
          value={record.teacherId}
          onChange={(value) =>
            handleTableChange(record.key, "teacherId", value)
          }
          style={{ width: "100%" }}
        >
          {record.availableTeachers.map((teacher) => (
            <Select.Option key={teacher.id} value={teacher.id}>
              {teacher.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ];

  const onFinish = async () => {
    setLoading(true);
    try {
      const scheduleData = tableData.map((item) => ({
        createScheduleDto: {
          shiftIds: item.shiftIds, // Store array of shift IDs
          classId: Number(classId),
          classroomId: item.classroomId,
          teacherId: item.teacherId,
          moduleId: item.moduleId,
          startDate: item.startDate,
        },
        selectedDays: item.selectedDays || [],
      }));
      const result = await scheduleService.autoGenerateSchedule(
        Number(classId),
        { schedules: scheduleData },
      );
      onSubmit(result);
      hideModal();
    } catch (error: any) {
      console.error("Error auto-generating schedule:", error);
      message.error(error?.response?.data?.error, 10);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thêm mới lịch học tự động"
      visible={isModalVisible}
      onCancel={hideModal}
      footer={null}
      width={1000}
    >
      <Spin spinning={loading} tip="Đang tạo lịch học...">
        <Table dataSource={tableData} columns={columns} pagination={false} />
        <Button
          type="primary"
          onClick={onFinish}
          style={{ marginTop: 16 }}
          disabled={loading}
        >
          Tạo lịch học tự động
        </Button>
      </Spin>
    </Modal>
  );
};

export default CreateScheduleAutoForm;
