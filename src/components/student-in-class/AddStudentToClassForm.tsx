import { Form, Input, Modal, Select, Table, Tag, notification } from "antd";
import { useEffect, useState } from "react";
import { Cohort } from "../../models/cohort.model";
import { CoursesFamily } from "../../models/courses.model";
import { StudentStatus } from "../../models/enum/student.status.enum";
import { Student } from "../../models/student.model";
import cohortService from "../../services/cohort-service/cohort.service";
import courseFamilyService from "../../services/course-family-service/course.family.service";
import { studentService } from "../../services/student-service/student.service";

interface Props {
  isModalVisible: boolean;
  hideModal: () => void;
  onStudentCreated: () => void;
  classId: string | undefined;
}

const AddStudentToClassForm = ({
  isModalVisible,
  hideModal,
  onStudentCreated,
  classId,
}: Props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [coursesFamily, setCoursesFamily] = useState<CoursesFamily[]>([]);
  const [cohort, setCohort] = useState<Cohort[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await studentService.findStudentsWithoutClass();
      const coursesFamilyData = await courseFamilyService.getAll();
      const cohortData = await cohortService.getAllCohort();
      setStudents(data.data);
      setFilteredStudents(data.data); // Set initial filtered students
      setCoursesFamily(coursesFamilyData);
      setCohort(cohortData.data);
    } catch (error) {
      notification.error({ message: "Error loading students" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSearchAndFilter = (searchValue: string, filterValues: any) => {
    let result = students;

    if (searchValue) {
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          s.studentId
            ?.toString()
            .toLowerCase()
            .includes(searchValue.toLowerCase()), // Handle potential null
      );
    }

    if (filterValues.coursesFamily) {
      result = result.filter(
        (s) => s.coursesFamily?.course_family_id === filterValues.coursesFamily,
      );
    }
    if (filterValues.cohort) {
      result = result.filter((s) => s.cohort?.id === filterValues.cohort);
    }
    if (filterValues.status) {
      result = result.filter((s) => s.status === filterValues.status);
    }

    setFilteredStudents(result);
  };

  useEffect(() => {
    handleSearchAndFilter(searchValue, form.getFieldsValue());
  }, [searchValue, students]);

  const handleSubmit = async () => {
    try {
      await studentService.createStudentWithClass(
        Number(classId),
        selectedRowKeys as number[],
      );
      notification.success({
        message: "Students added to class successfully!",
      });
      form.resetFields();
      setSelectedRowKeys([]);
      onStudentCreated();
      hideModal();
    } catch (error) {
      notification.error({ message: "Error adding students to class" });
    }
  };

  const handleFilterChange = (_, allValues: any) => {
    handleSearchAndFilter(searchValue, allValues);
  };

  const columns = [
    {
      title: "Mã SV",
      dataIndex: "studentId",
      key: "studentId",
      render: (studentId: string | null) => <Tag>{studentId || "N/A"}</Tag>,
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ngành học",
      dataIndex: ["coursesFamily", "course_family_name"],
      key: "coursesFamily",
    },
    {
      title: "Khóa",
      dataIndex: ["cohort", "name"],
      key: "cohort",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: StudentStatus) => {
        const statusColors: Record<StudentStatus, string> = {
          [StudentStatus.STUDYING]: "green",
          [StudentStatus.DELAY]: "orange",
          [StudentStatus.DROPOUT]: "red",
          [StudentStatus.GRADUATED]: "blue",
          [StudentStatus.FAILED]: "grey",
        };
        return <Tag color={statusColors[status]}>{status || "N/A"}</Tag>;
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    getCheckboxProps: (record: Student) => ({
      disabled: false,
      name: record.name,
    }),
  };

  useEffect(() => {
    const currentlySelectedKeys = selectedRowKeys.filter((key) =>
      filteredStudents.some((student) => student.studentId === key),
    );
    setSelectedRowKeys(currentlySelectedKeys);
  }, [filteredStudents]);

  return (
    <Modal
      title="Thêm sinh viên vào lớp"
      open={isModalVisible}
      onCancel={hideModal}
      onOk={handleSubmit}
      okText="Thêm"
      cancelText="Hủy"
      width={1000}
    >
      <Form form={form} layout="vertical" onValuesChange={handleFilterChange}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Form.Item name="coursesFamily" style={{ width: "30%" }}>
            <Select placeholder="Ngành học" allowClear>
              {coursesFamily.map((cf) => (
                <Select.Option
                  key={cf.course_family_id}
                  value={cf.course_family_id}
                >
                  {cf.course_family_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="cohort" style={{ width: "30%" }}>
            <Select placeholder="Khóa" allowClear>
              {cohort.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" style={{ width: "30%" }}>
            <Select placeholder="Trạng thái" allowClear>
              {Object.values(StudentStatus).map((status) => (
                <Select.Option key={status} value={status}>
                  {status}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <Form.Item>
          <Input.Search
            placeholder="Tìm kiếm theo Mã SV hoặc Tên"
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ width: "100%" }}
            disabled={loading}
          />
        </Form.Item>
      </Form>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredStudents}
        rowKey="id"
        loading={loading}
      />
    </Modal>
  );
};

export default AddStudentToClassForm;
