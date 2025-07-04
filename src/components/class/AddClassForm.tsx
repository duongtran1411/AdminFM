// components/class/AddClassForm.tsx
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { CoursesFamily } from "../../models/courses.model";
import { ClassStatus } from "../../models/enum/class.status.enum";
import { Response } from "../../models/response.model";
import { ClassResponse } from "../../services/class-service/class.service";
import courseFamilyService from "../../services/course-family-service/course.family.service";
import cohortService from "../../services/cohort-service/cohort.service";
import { Cohort } from "../../models/cohort.model";
import { Semester } from "../../models/semester.model";
import semesterService from "../../services/semester-service/semester.service";

interface AddClassFormProps {
  visible: boolean;
  onAdd: (values: Response<ClassResponse>) => void;
  onCancel: () => void;
}
const AddClassForm: React.FC<AddClassFormProps> = ({
  visible,
  onAdd,
  onCancel,
}) => {
  const [coursesfamily, setCoursesFamily] = useState<CoursesFamily[]>([]);
  const [autoAddStudents, setAutoAddStudents] = useState<boolean>(false);
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

  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    const classData: Response<ClassResponse> = {
      ...values,
      courses_family_id: values.course_family_name,
      tick: values.isActive || false,
      studentCount: values.studentCount || 20,
      admissionDate: moment(values.admissionDate).format("YYYY-MM-DD"),
      term_number: values.term_number,
      cohort_id: values.cohort_id,
    };
    onAdd(classData);
    form.resetFields();
  };

  const handleAutoAddChange = (e: any) => {
    setAutoAddStudents(e.target.checked);
  };

  // const disabledDate = (current: any) => {
  //   return current && current < moment().startOf("day");
  // };

  return (
    <Modal
      title="Thêm Lớp Học"
      visible={visible}
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
        <Form.Item
          name="course_family_name"
          label="Courses Family"
          rules={[
            {
              required: true,
              message: "Please select the Courses Family!",
            },
          ]}
        >
          <Select placeholder="Chọn Courses Family">
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
          <Select placeholder="Chọn Kỳ học">
            {semesters.map((semester) => (
              <Select.Option key={semester.id} value={semester.id}>
                {semester.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* <Form.Item
          name="admissionDate"
          label="Ngày nhập học"
          rules={[{ required: true }]}
        >
          <DatePicker disabledDate={disabledDate} />
        </Form.Item> */}
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
        <Form.Item name="isActive" valuePropName="checked">
          <Checkbox onChange={handleAutoAddChange}>
            Tự động thêm sinh viên
          </Checkbox>
        </Form.Item>
        {autoAddStudents && (
          <Form.Item
            name="studentCount"
            label="Số lượng sinh viên"
            rules={[
              { required: true, message: "Vui lòng nhập số lượng sinh viên" },
            ]}
          >
            <InputNumber
              min={1}
              placeholder="Nhập số lượng sinh viên"
              style={{ width: "100%" }}
            />
          </Form.Item>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Thêm
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddClassForm;
