import { Form, Input, Modal, notification, Checkbox, Spin } from "antd";
import { useEffect, useState } from "react";
import { Courses, Module } from "../../models/courses.model";
import { courseService } from "../../services/courses-service/courses.service";
import { moduleService } from "../../services/module-serice/module.service";

interface Props {
  isModalVisible: boolean;
  hideModal: () => void;
  onCourseCreated: () => void;
}

const AddCourseForm = ({
  isModalVisible,
  hideModal,
  onCourseCreated,
}: Props) => {
  const [form] = Form.useForm();
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModules, setSelectedModules] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);
      try {
        const moduleList = await moduleService.getAllModules();
        setModules(moduleList);
      } catch (error) {
        console.error("Failed to fetch modules", error);
      } finally {
        setLoading(false);
      }
    };

    if (isModalVisible) {
      fetchModules();
    }
  }, [isModalVisible]);

  const handleModuleChange = (checkedValues: number[]) => {
    setSelectedModules(checkedValues);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const newCourse: Courses = {
        ...values,
        modules: selectedModules,
      };
      await courseService.addCourse(newCourse);
      onCourseCreated();
      notification.success({ message: "Course created successfully!" });
      form.resetFields();
      setSelectedModules([]); // Clear selected modules after submission
      hideModal();
    } catch (info) {
      console.log("Validate Failed:", info);
    }
  };

  return (
    <Modal
      title="Create New Course"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={hideModal}
      okText="Create"
      cancelText="Cancel"
      centered
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="course_name"
          label="Course Name"
          rules={[
            { required: true, message: "Please input the Course's name!" },
          ]}
        >
          <Input placeholder="Enter Course's name" />
        </Form.Item>
        <Form.Item
          name="course_code"
          label="Course Code"
          rules={[
            { required: true, message: "Please input the Course's code!" },
          ]}
        >
          <Input placeholder="Enter Course's code" />
        </Form.Item>
        <Form.Item
          name="modules"
          label="Select Modules"
          rules={[
            { required: true, message: "Please select at least one module!" },
          ]}
          valuePropName="checked"
        >
          <Checkbox.Group
            onChange={handleModuleChange}
            style={{ width: "100%" }}
          >
            {modules.map((module) => (
              <Checkbox key={module.module_id} value={module.module_id}>
                {module.module_name}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCourseForm;
