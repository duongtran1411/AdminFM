import { Form, Input, Modal, notification } from "antd";
import { useEffect } from "react";
import { CoursesFamily } from "../../models/courses.model";
import courseFamilyService from "../../services/course-family-service/course.family.service";

interface EditCourseFamilyFormProps {
  isModalVisible: boolean;
  hideModal: () => void;
  coursefamily: CoursesFamily | null;
  onUpdate: () => void;
}

const EditCourseFamilyForm = ({
  isModalVisible,
  hideModal,
  coursefamily,
  onUpdate,
}: EditCourseFamilyFormProps) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (coursefamily) {
      form.setFieldsValue({
        course_family_name: coursefamily.course_family_name,
        year: coursefamily.year,
      });
    }
  }, [coursefamily, form]);

  // Handle when the "OK" button is pressed
  const handleOk = async () => {
    Modal.confirm({
      title: "Are you sure you want to update this Course Family?",
      okText: "Update",
      okType: "danger",
      onOk: async () => {
        try {
          const values = await form.validateFields();
          const updatedCourse = {
            ...coursefamily,
            ...values,
          };
          await courseFamilyService.update(
            updatedCourse.course_family_id,
            updatedCourse,
          );
          form.resetFields();
          hideModal();
          onUpdate();
          notification.success({
            message: "Course Family updated successfully",
          });
        } catch (error) {
          notification.error({ message: "Error updating Course" });
        }
      },
    });
  };

  return (
    <Modal
      title="Edit Course Family"
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
          name="course_family_name"
          label="Course Family Name"
          rules={[
            {
              required: true,
              message: "Please input the Course Family's name!",
            },
          ]}
        >
          <Input placeholder="Enter Course Family's name" />
        </Form.Item>
        <Form.Item
          name="year"
          label="Year"
          rules={[
            {
              required: true,
              message: "Please input the Year of the Course Family!",
            },
          ]}
        >
          <Input placeholder="Enter Year of the Course Family" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCourseFamilyForm;
