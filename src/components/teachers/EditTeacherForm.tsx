import { DatePicker, Form, Input, Modal, notification, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Module } from "../../models/courses.model";
import { Shifts } from "../../models/shifts";
import { Teachers } from "../../models/teacher.model";
import { moduleService } from "../../services/module-serice/module.service";
import { shiftsService } from "../../services/shifts-service/shifts.service";
import { teacherService } from "../../services/teacher-service/teacher.service";

interface EditTeacherFormProps {
  isModalVisible: boolean;
  hideModal: () => void;
  teacher: Teachers | null;
  onUpdate: () => void;
}

const EditTeacherForm = ({
  isModalVisible,
  hideModal,
  teacher,
  onUpdate,
}: EditTeacherFormProps) => {
  const [form] = Form.useForm();
  const [modules, setModules] = useState<Module[]>([]);
  const [shifts, setShifts] = useState<Shifts[]>([]);

  useEffect(() => {
    if (teacher) {
      form.setFieldsValue({
        ...teacher,
        birthdate: dayjs(teacher.birthdate),
        working_date: dayjs(teacher.working_date),
        modules: teacher.modules.map((module) => module.module_id),
        working_shift_ids: teacher.working_shift.map((shift) => shift.id),
      });
    }
  }, [teacher, form]);

  useEffect(() => {
    const fetchModules = async () => {
      const moduleList = await moduleService.getAllModules();
      setModules(moduleList);
    };

    const fetchShifts = async () => {
      const shiftList = await shiftsService.findAll();
      setShifts(shiftList);
    };

    fetchModules();
    fetchShifts();
  }, []);

  // Xử lý khi nhấn nút "OK"
  const handleOk = async () => {
    Modal.confirm({
      title: "Are you sure you want to update this teacher?",
      okText: "Update",
      okType: "danger",
      onOk: async () => {
        try {
          const values = await form.validateFields();
          const birthDate = dayjs(values.birthdate).format("YYYY-MM-DD");
          const workingDate = dayjs().format("YYYY-MM-DD");

          const updatedTeacher = {
            ...teacher,
            ...values,
            working_date: workingDate,
            birthdate: birthDate,
          };
          await teacherService.update(updatedTeacher.id, updatedTeacher);
          form.resetFields();
          hideModal();
          onUpdate();
          notification.success({ message: "Teacher updated successfully" });
        } catch (error) {
          notification.error({ message: "Error updating Teacher" });
        }
      },
    });
  };

  return (
    <Modal
      title="Edit Teacher"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields(); // Reset các trường form khi đóng modal
        hideModal();
      }}
      okText="Update"
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
              message: "Please input the name!",
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
              message: "Please input the phone number!",
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
              message: "Please select the gender!",
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
              message: "Please input the email!",
            },
            {
              type: "email",
              message: "The input is not valid E-mail!",
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
              message: "Please input the teacher's birth date!",
            },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="working_date"
          label="Ngày vào làm"
          rules={[
            {
              required: true,
              message: "Please input the teacher's working date!",
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
              message: "Please select at least one module!",
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select modules"
            style={{ width: "100%" }}
          >
            {modules.map((module) => (
              <Select.Option key={module.module_id} value={module.module_id}>
                {module.module_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="working_shift_ids"
          label="Shift"
          rules={[
            {
              required: true,
              message: "Please select at least one shift!",
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select shifts"
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

export default EditTeacherForm;
