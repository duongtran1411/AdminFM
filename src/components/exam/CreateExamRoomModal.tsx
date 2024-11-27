import React, { useEffect, useState } from "react";
import { Modal, Form, Select, InputNumber, notification } from "antd";
import { Classroom } from "../../models/classes.model";
import { Teachers } from "../../models/teacher.model";
import examRoomService from "../../services/exam-service/exam.room.service";
import classRoomService from "../../services/class-room-service/class.room.service";
import { teacherService } from "../../services/teacher-service/teacher.service";

interface CreateExamRoomModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  examScheduleId: number;
}

const CreateExamRoomModal: React.FC<CreateExamRoomModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  examScheduleId,
}) => {
  const [form] = Form.useForm();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [teachers, setTeachers] = useState<Teachers[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchClassrooms();
      fetchTeachers();
    }
  }, [visible]);

  const fetchClassrooms = async () => {
    try {
      const response = await classRoomService.getClassrooms();
      setClassrooms(response);
    } catch (error) {
      notification.error({ message: "Lỗi khi tải danh sách phòng học" });
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await teacherService.findAll();
      setTeachers(response);
    } catch (error) {
      notification.error({ message: "Lỗi khi tải danh sách giáo viên" });
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await examRoomService.create({
        ...values,
        exam_schedule_master_id: examScheduleId,
      });

      notification.success({ message: "Tạo phòng thi thành công" });
      form.resetFields();
      onSuccess();
    } catch (error) {
      notification.error({ message: "Lỗi khi tạo phòng thi" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thêm phòng thi mới"
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="classroom_id"
          label="Phòng học"
          rules={[{ required: true, message: "Vui lòng chọn phòng học" }]}
        >
          <Select
            placeholder="Chọn phòng học"
            options={classrooms.map((classroom) => ({
              label: classroom.name,
              value: classroom.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="teacher_id"
          label="Giám thị"
          rules={[{ required: true, message: "Vui lòng chọn giám thị" }]}
        >
          <Select
            placeholder="Chọn giám thị"
            options={teachers.map((teacher) => ({
              label: teacher.name,
              value: teacher.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="capacity"
          label="Số lượng thí sinh"
          rules={[
            { required: true, message: "Vui lòng nhập số lượng thí sinh" },
          ]}
        >
          <InputNumber
            placeholder="Nhập số lượng thí sinh"
            min={1}
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateExamRoomModal;
