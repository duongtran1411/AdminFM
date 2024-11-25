// components/class/EditClassForm.tsx
import { Button, Form, Input, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { Cohort } from "../../models/cohort.model";
import { CoursesFamily } from "../../models/courses.model";
import { ClassStatus } from "../../models/enum/class.status.enum";
import { Semester } from "../../models/semester.model";
import cohortService from "../../services/cohort-service/cohort.service";
import courseFamilyService from "../../services/course-family-service/course.family.service";
import semesterService from "../../services/semester-service/semester.service";

interface EditClassFormProps {
  visible: boolean;
  onEdit: (values: any) => void;
  onCancel: () => void;
  initialValues: any;
}

const EditClassForm: React.FC<EditClassFormProps> = ({
  visible,
  onEdit,
  onCancel,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const [coursesfamily, setCoursesFamily] = useState<CoursesFamily[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  useEffect(() => {
    const fetchCourse = async () => {
      const cfm = await courseFamilyService.getAll();
      setCoursesFamily(cfm);
    };
    const fetchCohort = async () => {
      const cohorts = await cohortService.getAllCohort();
      setCohorts(cohorts.data);
    };
    const fetchSemester = async () => {
      const semesters = await semesterService.findAll();
      setSemesters(semesters);
    };
    if (visible) {
      fetchCourse();
      fetchCohort();
      fetchSemester();
    }
  }, [visible]);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const handleFinish = (values: any) => {
    onEdit({
      name: values.name,
      courses_family_id: values.course_family_id,
      semester_id: values.semester_id,
      status: values.status,
      admissionDate: values.admissionDate,
      cohort_id: values.cohort_id,
    });
    form.resetFields();
  };

  return (
    <Modal
      title="Chỉnh Sửa Lớp Học"
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Tên Lớp"
          rules={[{ required: true, message: "Vui lòng nhập tên lớp" }]}
        >
          <Input placeholder="Nhập tên lớp" />
        </Form.Item>
        <Form.Item name="course_family_id" label="Courses Family">
          <Select
            placeholder="Chọn Courses Family"
            defaultValue={initialValues.course_family_name}
          >
            {coursesfamily.map((c) => (
              <Select.Option
                key={c.course_family_id}
                value={c.course_family_id}
              >
                {c.course_family_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="semester_id"
          label="Kỳ học"
          rules={[{ required: true, message: "Vui lòng nhập Kỳ học!" }]}
        >
          <Select
            placeholder="Chọn Kỳ học"
            defaultValue={initialValues.semester_id}
          >
            {semesters.map((s) => (
              <Select.Option key={s.id} value={s.id}>
                {s.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="cohort_id" label="Cohort">
          <Select placeholder="Chọn Cohort">
            {cohorts.map((c) => (
              <Select.Option key={c.id} value={c.id}>
                {c.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="status" label="Trạng thái">
          <Select placeholder="Chọn trạng thái">
            {Object.values(ClassStatus).map((status) => (
              <Select.Option key={status} value={status}>
                {status}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Cập Nhật
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditClassForm;
