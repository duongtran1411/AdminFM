import { Button, Form, Input, Select, Modal } from "antd";
import React, { useEffect, useState } from "react";
import {
  CreateScheduleData,
  ScheduleData,
  scheduleService,
} from "../../services/schedule-service/schedule.service";
import { useParams } from "react-router-dom";

const UpdateScheduleForm: React.FC<{
  initialValues: ScheduleData | undefined;
  isModalVisible: boolean;
  hideModal: () => void;
  onSubmit: (values: CreateScheduleData) => void;
}> = ({ initialValues, isModalVisible, hideModal, onSubmit }) => {
  const [form] = Form.useForm();
  const { classId } = useParams();
  const [shifts, setShifts] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shiftsData, classroomsData, teacherData, subjectsData] =
          await Promise.all([
            scheduleService.getShifts(),
            scheduleService.getClassrooms(),
            scheduleService.getLecturers(),
            scheduleService.getModule(),
          ]);
        setShifts(shiftsData);
        setClassrooms(classroomsData);
        setTeachers(teacherData);
        setModules(subjectsData);
      } catch (error) {
        console.error("Error fetching data for UpdateScheduleForm:", error);
      }
    };

    fetchData();
    if (initialValues) {
      form.setFieldsValue({
        date: initialValues.date.split("T")[0],
        classroomId: initialValues.classroom.id,
        shiftId: initialValues.shift.id,
        teacherId: initialValues.teacher.id,
        moduleId: initialValues.module.module_id,
      });
    }
  }, [initialValues, form]);

  const onFinish = (values: CreateScheduleData) => {
    const updatedValues = {
      ...values,
      classId, // Thêm classId từ useParams
    };
    onSubmit(updatedValues);
    form.resetFields();
    hideModal(); // Ẩn modal sau khi submit
  };

  return (
    <Modal
      title="Cập nhật lịch học"
      visible={isModalVisible}
      onCancel={hideModal}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="date"
          label="Ngày"
          rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item
          name="classroomId"
          label="Phòng học"
          rules={[{ required: true, message: "Vui lòng chọn phòng học!" }]}
        >
          <Select>
            {classrooms.map((classroom) => (
              <Select.Option key={classroom.id} value={classroom.id}>
                {classroom.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="shiftId"
          label="Ca học"
          rules={[{ required: true, message: "Vui lòng chọn ca học!" }]}
        >
          <Select>
            {shifts.map((shift) => (
              <Select.Option key={shift.id} value={shift.id}>
                {shift.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="teacherId"
          label="Giảng viên"
          rules={[{ required: true, message: "Vui lòng chọn giảng viên!" }]}
        >
          <Select>
            {teachers.map((teacher) => (
              <Select.Option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="moduleId"
          label="Môn học"
          rules={[{ required: true, message: "Vui lòng chọn môn học!" }]}
        >
          <Select>
            {modules.map((module) => (
              <Select.Option key={module.module_id} value={module.module_id}>
                {module.module_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Cập nhật
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={hideModal}>
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateScheduleForm;
