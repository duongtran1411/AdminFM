import { Button, Input, Modal, Select, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Classroom } from "../../models/classes.model";
import { Module } from "../../models/courses.model";
import { Shifts } from "../../models/shifts";
import { Teachers } from "../../models/teacher.model";
import classService from "../../services/class-service/class.service";
import { scheduleService } from "../../services/schedule-service/schedule.service";

const CreateScheduleAutoForm: React.FC<{
  isModalVisible: boolean;
  hideModal: () => void;
  onSubmit: (values: any) => void;
}> = ({ isModalVisible, hideModal, onSubmit }) => {
  const [shifts, setShifts] = useState<Shifts[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [teachers, setTeachers] = useState<Teachers[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const { classId } = useParams<{ classId: string }>();

  useEffect(() => {
    const fetchData = async () => {
      const [shiftsData, classroomsData, teacherData, modulesData] =
        await Promise.all([
          scheduleService.getShifts(),
          scheduleService.getClassrooms(),
          scheduleService.getTeachers(),
          classService.getModulesByCoursesFamilyOfClass(Number(classId!)),
        ]);
      setShifts(shiftsData);
      setClassrooms(classroomsData);
      setTeachers(teacherData);
      setModules(modulesData);

      const initialTableData = modulesData.map((module) => ({
        key: module.module_id.toString(),
        moduleId: module.module_id,
        startDate: "",
        classroomId: undefined,
        shiftId: undefined,
        teacherId: undefined,
      }));
      setTableData(initialTableData);
    };

    fetchData();
  }, [classId]);

  const columns = [
    {
      title: "Môn học",
      dataIndex: "moduleId",
      key: "moduleId",
      render: (_: any, record: any) => {
        const module = modules.find((m) => m.module_id === record.moduleId);
        return (
          <div style={{ width: "100%" }}>
            {module ? module.module_name : "N/A"}
          </div>
        );
      },
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (_: any, record: any) => (
        <Input
          type="date"
          value={record.startDate}
          onChange={(e) =>
            handleTableChange(record.key, "startDate", e.target.value)
          }
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Phòng học",
      dataIndex: "classroomId",
      key: "classroomId",
      render: (_: any, record: any) => (
        <Select
          value={record.classroomId}
          onChange={(value) =>
            handleTableChange(record.key, "classroomId", value)
          }
          style={{ width: "100%" }}
          optionLabelProp="label"
        >
          {classrooms.map((classroom) => (
            <Select.Option
              key={classroom.id}
              value={classroom.id}
              label={classroom.name}
            >
              {classroom.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Ca học",
      dataIndex: "shiftId",
      key: "shiftId",
      render: (_: any, record: any) => (
        <Select
          value={record.shiftId}
          onChange={(value) => handleTableChange(record.key, "shiftId", value)}
          style={{ width: "100%" }}
          optionLabelProp="label"
        >
          {shifts.map((shift) => (
            <Select.Option key={shift.id} value={shift.id} label={shift.name}>
              {shift.name}
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
          value={record.teacherId}
          onChange={(value) =>
            handleTableChange(record.key, "teacherId", value)
          }
          style={{ width: "100%" }}
          optionLabelProp="label"
          listHeight={400}
          dropdownStyle={{ minWidth: "150px" }}
        >
          {teachers.map((teacher) => (
            <Select.Option
              key={teacher.id}
              value={teacher.id}
              label={teacher.name}
            >
              <div
                style={{
                  whiteSpace: "normal",
                  padding: "8px 0",
                  lineHeight: "1.5",
                  fontSize: "14px",
                }}
              >
                {teacher.name}
              </div>
            </Select.Option>
          ))}
        </Select>
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
          dropdownStyle={{ minWidth: "150px" }}
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
  ];

  const handleTableChange = (key: string, dataIndex: string, value: any) => {
    setTableData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, [dataIndex]: value } : item,
      ),
    );
  };

  const onFinish = async () => {
    try {
      const scheduleData = tableData.map((item) => ({
        createScheduleDto: {
          shiftId: item.shiftId,
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
      message.success("Lịch học đã được tạo tự động thành công!");
      hideModal();
    } catch (error) {
      console.error("Error auto-generating schedule:", error);
      message.error("Có lỗi xảy ra khi tạo lịch học tự động.");
    }
  };

  const handleHideModal = () => {
    hideModal();
  };

  return (
    <Modal
      title="Thêm mới lịch học tự động"
      visible={isModalVisible}
      onCancel={handleHideModal}
      footer={null}
      width={1000}
    >
      <Table dataSource={tableData} columns={columns} pagination={false} />
      <Button type="primary" onClick={onFinish} style={{ marginTop: 16 }}>
        Tạo lịch học tự động
      </Button>
    </Modal>
  );
};

export default CreateScheduleAutoForm;
