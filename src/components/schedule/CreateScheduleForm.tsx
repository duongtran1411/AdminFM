import { Button, Form, Input, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CreateScheduleData } from "../../models/schedules.model";
import { scheduleService } from "../../services/schedule-service/schedule.service";
import { moduleService } from "../../services/module-serice/module.service";

const CreateScheduleForm: React.FC<{
  isModalVisible: boolean;
  hideModal: () => void;
  onSubmit: (values: CreateScheduleData) => void;
}> = ({ isModalVisible, hideModal, onSubmit }) => {
  const [form] = Form.useForm();
  const { classId } = useParams();
  const [shifts, setShifts] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const [shiftsData, classroomsData, teacherData, modulesResponse] =
        await Promise.all([
          scheduleService.getShifts(),
          scheduleService.getClassrooms(),
          scheduleService.getTeachers(),
          moduleService.getAllModules(),
        ]);
      setShifts(shiftsData);
      setClassrooms(classroomsData);
      setTeachers(teacherData);
      setModules(modulesResponse.data);
    } catch (error) {
      console.error("Error fetching data for CreateScheduleForm:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Gọi hàm fetchData khi component được mount
  }, []);

  const onFinish = async (values: CreateScheduleData) => {
    const updatedValues = {
      ...values,
      classId,
    };

    // Gọi onSubmit và chờ đợi kết quả
    await onSubmit(updatedValues);

    // Gọi lại hàm fetch để cập nhật dữ liệu
    await fetchData(); // Gọi lại hàm fetchData để lấy dữ liệu mới

    form.resetFields();
    hideModal();
  };

  return (
    <Modal
      title="Thêm mới lịch học"
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
                {module.code}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Thêm mới
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={hideModal}>
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateScheduleForm;
