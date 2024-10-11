import { Checkbox, Form, Input, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { courseService } from "../../services/courses-service/courses.service";
import { Courses, Module } from "../../models/courses.model";
import { moduleService } from "../../services/module-serice/module.service";

interface EditCourseFormProps {
  isModalVisible: boolean;
  hideModal: () => void;
  course: Courses | null;
  onUpdate: () => void;
}

const EditCourseForm = ({
  isModalVisible,
  hideModal,
  course,
  onUpdate,
}: EditCourseFormProps) => {
  const [form] = Form.useForm();
  const [selectedModules, setSelectedModules] = useState<number[]>([]);
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    if (course) {
      form.setFieldsValue({
        course_name: course.course_name,
        course_code: course.course_code,
      });
      setSelectedModules(course.modules.map((module) => module.module_id));
    }
  }, [course, form]);

  useEffect(() => {
    const fetchModules = async () => {
      const moduleList = await moduleService.getAllModules();
      setModules(moduleList);
    };

    if (isModalVisible) {
      fetchModules();
    }
  }, [isModalVisible]);

  // Handle when the "OK" button is pressed
  const handleOk = async () => {
    Modal.confirm({
      title: "Are you sure you want to update this Course?",
      okText: "Update",
      okType: "danger",
      onOk: async () => {
        try {
          const values = await form.validateFields();
          const updatedCourse = {
            ...course,
            ...values,
            modules: selectedModules,
          };
          await courseService.updateCourse(
            updatedCourse.course_id,
            updatedCourse,
          );
          form.resetFields();
          hideModal();
          onUpdate();
          notification.success({ message: "Course updated successfully" });
        } catch (error) {
          notification.error({ message: "Error updating Course" });
        }
      },
    });
  };

  const handleModuleChange = (checkedValues: number[]) => {
    setSelectedModules(checkedValues);
  };

  return (
    <Modal
      title="Edit Course"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        hideModal();
      }}
      okText="Update"
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
          label="Select Modules"
          rules={[
            { required: true, message: "Please select at least one module!" },
          ]}
        >
          <Checkbox.Group
            value={selectedModules}
            onChange={handleModuleChange}
            style={{ width: "100%" }}
          >
            {modules.map((module) => {
              return (
                <Checkbox key={module.module_id} value={module.module_id}>
                  {module.module_name}
                </Checkbox>
              );
            })}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCourseForm;
