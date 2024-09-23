import { Checkbox, Form, Input, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { Courses, CoursesFamily } from "../../models/courses.model";
import courseFamilyService from "../../services/course-family-service/course.family.service";
import { courseService } from "../../services/courses-service/courses.service";

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
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [course, setCourse] = useState<Courses[]>([]);

  useEffect(() => {
    if (coursefamily) {
      form.setFieldsValue({
        course_family_name: coursefamily.course_family_name,
        year: coursefamily.year,
      });
      setSelectedCourses(coursefamily.courses.map((c) => c.course_id));
    }
  }, [coursefamily, form]);

  useEffect(() => {
    const fetchCourses = async () => {
      const courseList = await courseService.getAllCourses();
      setCourse(courseList);
    };

    if (isModalVisible) {
      fetchCourses();
    }
  }, [isModalVisible]);

  const handleOk = async () => {
    Modal.confirm({
      title: "Are you sure you want to update this Course Family?",
      okText: "Update",
      okType: "danger",
      onOk: async () => {
        try {
          const values = await form.validateFields();
          const updatedCourseFamily = {
            ...coursefamily,
            ...values,
            courses: selectedCourses,
          };
          await courseFamilyService.update(
            updatedCourseFamily.course_family_id,
            updatedCourseFamily,
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

  const hanldeChange = (checkedValues: number[]) => {
    setSelectedCourses(checkedValues);
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
        <Form.Item
          label="Select Courses"
          rules={[
            { required: true, message: "Please select at least one course!" },
          ]}
        >
          <Checkbox.Group
            value={selectedCourses}
            onChange={hanldeChange}
            style={{ width: "100%" }}
          >
            {course.map((c) => (
              <Checkbox key={c.course_id} value={c.course_id}>
                {c.course_name}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCourseFamilyForm;
