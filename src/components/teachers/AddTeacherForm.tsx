import { DatePicker, Form, Input, Modal, notification, Select } from "antd";
import { Teachers } from "../../models/teacher.model";
import { teacherService } from "../../services/teacher-service/teacher.service";
import dayjs from "dayjs";
import { Module } from "../../models/courses.model";
import { useEffect, useState } from "react";
import { moduleService } from "../../services/module-serice/module.service";
import { Shifts } from "../../models/shifts";
import { shiftsService } from "../../services/shifts-service/shifts.service";

interface Props {
  isModalVisible: boolean;
  hideModal: () => void;
  onTeacherCreated: () => void;
}

const AddTeacherForm = ({
  isModalVisible,
  hideModal,
  onTeacherCreated,
}: Props) => {
  const [form] = Form.useForm();
  const [modules, setModules] = useState<Module[]>([]);
  const [shifts, setShifts] = useState<Shifts[]>([]);
  useEffect(() => {
    const fetchModules = async () => {
      const moduleList = await moduleService.getAllModules();
      setModules(moduleList.data);
    };
    const fetchShifts = async () => {
      const shiftList = await shiftsService.findAll();
      setShifts(shiftList);
    };

    if (isModalVisible) {
      fetchModules();
      fetchShifts();
    }
  }, [isModalVisible]);

  const handleOk = async () => {
    const values = await form.validateFields();
    const birthDate = dayjs(values.birthdate).format("YYYY-MM-DD");
    const workingDate = dayjs(values.working_date).format("YYYY-MM-DD");

    const newTeacher: Teachers = {
      ...values,
      birthdate: birthDate,
      working_date: workingDate,
      userId: 2,
      modules: values.modules,
      working_shift: values.working_shift,
    };
    await teacherService.create(newTeacher);
    onTeacherCreated();
    notification.success({ message: "Thêm mới giảng viên thành công!" });
    form.resetFields();
    hideModal();
  };

  const disabledDate = (current: dayjs.Dayjs) => {
    return current && current > dayjs().endOf("day");
  };

  return (
    <Modal
      title="Tạo mới Giảng Viên"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={hideModal}
      okText="Create"
      cancelText="Cancel"
      centered
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên giảng viên"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên giảng viên!",
            },
          ]}
        >
          <Input placeholder="Nhập tên giảng viên" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="SĐT"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập SĐT!",
            },
          ]}
        >
          <Input placeholder="Nhập SĐT" />
        </Form.Item>
        <Form.Item
          name="gender"
          label="Giới tính"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn giới tính!",
            },
          ]}
        >
          <Select placeholder="Chọn giới tính">
            <Select.Option value="Nam">Nam</Select.Option>
            <Select.Option value="Nữ">Nữ</Select.Option>
            <Select.Option value="Khác">Khác</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập Email!",
            },
            {
              type: "email",
              message: "Địa chỉ Email không hợp lệ!",
            },
          ]}
        >
          <Input placeholder="Nhập Email" />
        </Form.Item>
        <Form.Item
          name="birthdate"
          label="Ngày Sinh"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập ngày sinh!",
            },
          ]}
        >
          <DatePicker
            format="YYYY-MM-DD"
            style={{ width: "100%" }}
            disabledDate={disabledDate}
          />
        </Form.Item>
        <Form.Item
          name="working_date"
          label="Ngày vào làm"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập ngày vào làm!",
            },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="modules"
          label="Modules"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn ít nhất một module!",
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn module"
            style={{ width: "100%" }}
          >
            {modules.map((module) => (
              <Select.Option key={module.module_id} value={module.module_id}>
                {module.code}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="working_shift"
          label="Shift"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn ít nhất một ca làm!",
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn ca làm"
            style={{ width: "100%" }}
          >
            {shifts.map((shift) => (
              <Select.Option key={shift.id} value={shift.id}>
                {shift.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTeacherForm;
