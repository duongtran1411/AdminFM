import { DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, DatePicker, message, Modal, Select, Spin, Table } from "antd";
import { debounce } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Module } from "../../models/courses.model";
import { Shifts } from "../../models/shifts";
import classService from "../../services/class-service/class.service";
import { scheduleService } from "../../services/schedule-service/schedule.service";

interface TableDataItem {
  key: string;
  moduleId: number;
  startDate?: string;
  classroomId?: number;
  teacherId?: number;
  availableClassrooms: any[];
  availableTeachers: any[];
  classDays: { selectedDays: string; shiftIds: number[] }[];
}

const CreateScheduleAutoForm: React.FC<{
  isModalVisible: boolean;
  hideModal: () => void;
  onSubmit: (values: any) => void;
}> = ({ isModalVisible, hideModal, onSubmit }) => {
  const [shifts, setShifts] = useState<Shifts[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [tableData, setTableData] = useState<TableDataItem[]>([]);
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

      const initialTableData: TableDataItem[] = modulesData.map((module) => ({
        key: module.module_id.toString(),
        moduleId: module.module_id,
        availableClassrooms: [],
        availableTeachers: [],
        classDays: [{ selectedDays: "", shiftIds: [] }],
      }));
      setTableData(initialTableData);
    };

    fetchData();
  }, [classId]);

  const fetchAvailableData = async (record: TableDataItem) => {
    if (record.startDate && record.classDays.length > 0) {
      try {
        // Chỉ lấy các classDay có đủ thông tin
        const validClassDays = record.classDays.filter(
          (day) => day.selectedDays && day.shiftIds.length > 0,
        );

        if (validClassDays.length > 0) {
          const [classrooms, teachers] = await Promise.all([
            scheduleService.getAvailableClassrooms(
              record.moduleId,
              record.startDate,
              validClassDays,
            ),
            scheduleService.getAvailableTeachers(
              record.moduleId,
              record.startDate,
              validClassDays,
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
        }
      } catch (error) {
        message.error(
          "Không thể lấy danh sách phòng học và giảng viên khả dụng.",
        );
      }
    }
  };

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

  const handleClassDaysChange = (
    recordKey: string,
    index: number,
    field: "selectedDays" | "shiftIds",
    value: any,
  ) => {
    setTableData((prevData) =>
      prevData.map((item) => {
        if (item.key === recordKey) {
          const newClassDays = [...item.classDays];
          newClassDays[index] = {
            ...newClassDays[index],
            [field]: value,
          };
          const updatedItem = { ...item, classDays: newClassDays };

          // Thêm debounce để tránh gọi API quá nhiều
          const debouncedFetch = debounce(() => {
            fetchAvailableData(updatedItem);
          }, 500);

          debouncedFetch();

          return updatedItem;
        }
        return item;
      }),
    );
  };

  const addClassDay = (recordKey: string) => {
    setTableData((prevData) =>
      prevData.map((item) => {
        if (item.key === recordKey) {
          return {
            ...item,
            classDays: [...item.classDays, { selectedDays: "", shiftIds: [] }],
          };
        }
        return item;
      }),
    );
  };

  // Add function to remove class day
  const removeClassDay = (recordKey: string, index: number) => {
    setTableData((prevData) =>
      prevData.map((item) => {
        if (item.key === recordKey) {
          const newClassDays = [...item.classDays];
          newClassDays.splice(index, 1);
          return { ...item, classDays: newClassDays };
        }
        return item;
      }),
    );
  };

  const handleDateChange = (recordKey: string, date: string) => {
    setTableData((prevData) =>
      prevData.map((item) => {
        if (item.key === recordKey) {
          const updatedItem = { ...item, startDate: date };

          if (
            updatedItem.classDays.some(
              (day) => day.selectedDays && day.shiftIds.length > 0,
            )
          ) {
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
      width: "15%",
      render: (_: any, record: TableDataItem) => {
        const module = modules.find((m) => m.module_id === record.moduleId);
        return (
          <div style={{ fontWeight: 500 }}>{module ? module.code : "N/A"}</div>
        );
      },
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      width: "30%",
      render: (_: any, record: TableDataItem) => (
        <DatePicker
          value={record.startDate ? moment(record.startDate) : null}
          onChange={(_, dateString) =>
            handleDateChange(record.key, dateString as string)
          }
          disabledDate={(current) => current && current < moment().endOf("day")}
          style={{ width: "100%" }}
          placeholder="Chọn ngày bắt đầu"
        />
      ),
    },
    {
      title: "Lịch học",
      key: "classDays",
      width: "20%",
      render: (_: any, record: TableDataItem) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {record.classDays.map((classDay, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                gap: "5px",
                alignItems: "center",
                background: "#f5f5f5",
                padding: "8px",
                borderRadius: "6px",
              }}
            >
              <Select
                style={{ width: "150px" }}
                value={classDay.selectedDays}
                placeholder="Chọn thứ"
                onChange={(value) =>
                  handleClassDaysChange(
                    record.key,
                    index,
                    "selectedDays",
                    value,
                  )
                }
              >
                {[
                  { value: "Monday", label: "Thứ 2" },
                  { value: "Tuesday", label: "Thứ 3" },
                  { value: "Wednesday", label: "Thứ 4" },
                  { value: "Thursday", label: "Thứ 5" },
                  { value: "Friday", label: "Thứ 6" },
                  { value: "Saturday", label: "Thứ 7" },
                  { value: "Sunday", label: "Chủ nhật" },
                ].map((day) => (
                  <Select.Option key={day.value} value={day.value}>
                    {day.label}
                  </Select.Option>
                ))}
              </Select>
              <Select
                mode="multiple"
                style={{ width: "200px" }}
                value={classDay.shiftIds}
                placeholder="Chọn ca học"
                onChange={(value) =>
                  handleClassDaysChange(record.key, index, "shiftIds", value)
                }
              >
                {shifts.map((shift) => (
                  <Select.Option key={shift.id} value={shift.id}>
                    {shift.name}
                  </Select.Option>
                ))}
              </Select>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeClassDay(record.key, index)}
                disabled={record.classDays.length === 1}
              />
            </div>
          ))}
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={() => addClassDay(record.key)}
            style={{ alignSelf: "flex-start" }}
          >
            Thêm lịch học
          </Button>
        </div>
      ),
    },
    {
      title: "Phòng học",
      dataIndex: "classroomId",
      key: "classroomId",
      width: "15%",
      render: (_: any, record: any) => (
        <Select
          showSearch
          dropdownStyle={{ minWidth: "150px" }}
          value={record.classroomId}
          placeholder="Chọn phòng học"
          onChange={(value) =>
            handleTableChange(record.key, "classroomId", value)
          }
          style={{ width: "100%" }}
          optionFilterProp="children"
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
      width: "20%",
      render: (_: any, record: any) => (
        <Select
          showSearch
          dropdownStyle={{ minWidth: "200px" }}
          value={record.teacherId}
          placeholder="Chọn giảng viên"
          onChange={(value) =>
            handleTableChange(record.key, "teacherId", value)
          }
          style={{ width: "100%" }}
          optionFilterProp="children"
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

  const isFormValid = () => {
    return !tableData.some(
      (item) =>
        !item.startDate ||
        !item.classroomId ||
        !item.teacherId ||
        item.classDays.some(
          (day) => !day.selectedDays || day.shiftIds.length === 0,
        ),
    );
  };

  const onFinish = async () => {
    setLoading(true);
    try {
      const scheduleData = tableData.map((item) => ({
        createScheduleDto: {
          moduleId: item.moduleId,
          classroomId: item.classroomId!,
          teacherId: item.teacherId!,
          startDate: item.startDate!,
          classId: Number(classId),
          classDay: item.classDays,
        },
      }));

      const result = await scheduleService.autoGenerateSchedule(
        Number(classId),
        { schedules: scheduleData },
      );

      onSubmit(result);
      hideModal();
    } catch (error: any) {
      message.error(error?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div
          style={{
            fontSize: "18px",
            fontWeight: 500,
            color: "#333",
          }}
        >
          Thêm mới lịch học nhanh
        </div>
      }
      visible={isModalVisible}
      onCancel={hideModal}
      footer={null}
      width={1300}
      style={{ top: 20, marginTop: 50 }}
    >
      <Spin spinning={loading} tip="Đang tạo lịch học...">
        <div
          style={{
            background: "#fafafa",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          <Table
            dataSource={tableData}
            columns={columns}
            pagination={false}
            bordered
            style={{ marginBottom: "16px" }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="default"
              onClick={hideModal}
              style={{ marginRight: 8 }}
            >
              Hủy
            </Button>
            <Button
              type="primary"
              onClick={onFinish}
              disabled={loading || !isFormValid()}
              icon={<SaveOutlined />}
            >
              Tạo lịch nhanh
            </Button>
          </div>
        </div>
      </Spin>
    </Modal>
  );
};

export default CreateScheduleAutoForm;
