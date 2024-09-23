import { Checkbox, Form, Input, Modal, notification } from "antd";
import { Courses, CoursesFamily } from "../../models/courses.model";
import courseFamilyService from "../../services/course-family-service/course.family.service";
import { useEffect, useState } from "react";
import { courseService } from "../../services/courses-service/courses.service";

interface Props {
  isModalVisible: boolean;
  hideModal: () => void;
  onCourseCreated: () => void;
}

const AddCourseFamilyForm = ({
  isModalVisible,
  hideModal,
  onCourseCreated,
}: Props) => {
  const [form] = Form.useForm();
  const [courses, setCourses] = useState<Courses[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);

  useEffect(() => {
    const fetchCourse = async () => {
      const course = await courseService.getAllCourses();
      setCourses(course);
    };

    if (isModalVisible) {
      fetchCourse();
    }
  }, [isModalVisible]);

  const handleChange = (checkedValues: number[]) => {
    setSelectedCourses(checkedValues);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const newCourseFmaily: CoursesFamily = {
        ...values,
        courses: selectedCourses,
      };
      await courseFamilyService.add(newCourseFmaily);
      onCourseCreated();
      notification.success({ message: "Course Family created successfully!" });
      form.resetFields();
      setSelectedCourses([]);
      hideModal();
    } catch (info) {
      console.log("Validate Failed:", info);
    }
  };

  return (
    <Modal
      title="Create New Course Family"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={hideModal}
      okText="Create"
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
          name="courses"
          label="Select Courses"
          rules={[
            { required: true, message: "Please select at least one module!" },
          ]}
          valuePropName="checked"
        >
          <Checkbox.Group onChange={handleChange} style={{ width: "100%" }}>
            {courses.map((course) => (
              <Checkbox key={course.course_id} value={course.course_id}>
                {course.course_name}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCourseFamilyForm;
