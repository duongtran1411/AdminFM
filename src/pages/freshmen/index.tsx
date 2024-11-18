import { Checkbox, Layout, Modal, notification, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import Loading from "../../components/common/loading";
import TabsMenu from "../../components/student-in-class/TabsMenu";
import EditStudentForm from "../../components/student/EditStudentForm";
import FreshmenFilter from "../../components/student/FreshmenFilter";
import StudentTable from "../../components/student/StudentTable";
import useModals from "../../hooks/useModal";
import { StudentStatus } from "../../models/enum/student.status.enum";
import { Student } from "../../models/student.model";
import { studentService } from "../../services/student-service/student.service";

const FreshmenPageList = () => {
  const { isVisible, showModal, hideModal } = useModals();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [admissionPrograms, setAdmissionPrograms] = useState<string[]>([]);
  const [selectedAdmissionProgram, setSelectedAdmissionProgram] = useState<
    string | null
  >(null);
  const [coursesFamilies, setCoursesFamilies] = useState<string[]>([]);
  const [selectedCoursesFamily, setSelectedCoursesFamily] = useState<
    string | null
  >(null);

  const fetchStudents = async () => {
    try {
      const data = await studentService.findStudentsWithoutClass();
      setStudents(data.data);
      setFilteredStudents(data.data);
      const programs = [
        ...new Set(
          data.data
            .map((student) => student.application?.admissionProgram?.name)
            .filter(Boolean),
        ),
      ];
      const families = [
        ...new Set(
          data.data
            .map((student) => student.coursesFamily?.course_family_name)
            .filter(Boolean),
        ),
      ];

      setAdmissionPrograms(programs.filter(Boolean) as string[]);
      setCoursesFamilies(families as string[]);
    } catch (error) {
      setError("Error loading students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    let result = students;

    if (searchTerm) {
      result = result.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.studentId?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedAdmissionProgram) {
      result = result.filter(
        (student) =>
          student.application?.admissionProgram?.name ===
          selectedAdmissionProgram,
      );
    }

    if (selectedCoursesFamily) {
      result = result.filter(
        (student) =>
          student.coursesFamily?.course_family_name === selectedCoursesFamily,
      );
    }

    setFilteredStudents(result);
  }, [students, searchTerm, selectedAdmissionProgram, selectedCoursesFamily]);

  const handleSelect = (id: number) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((key) => key !== id) : [...prev, id],
    );
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this student?",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await studentService.remove(id);
          setStudents((prev) => prev.filter((student) => student.id !== id));
          notification.success({ message: "Student deleted successfully" });
        } catch {
          notification.error({ message: "Error deleting student" });
        }
      },
    });
  };

  const handleEdit = (id: number) => {
    const student = students.find((s) => s.id === id);
    if (student) {
      setSelectedStudent(student);
      showModal("editStudent");
    }
  };

  const columns = [
    {
      title: (
        <Checkbox
          onChange={() => {
            setSelectedStudentIds(
              filteredStudents.length === selectedStudentIds.length
                ? []
                : filteredStudents.map((item) => item.id),
            );
          }}
          checked={filteredStudents.length === selectedStudentIds.length}
        />
      ),
      dataIndex: "select",
      key: "select",
      render: (_: any, record: Student) => (
        <Checkbox
          checked={selectedStudentIds.includes(record.id)}
          onChange={() => handleSelect(record.id)}
        />
      ),
    },
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
      title: "Courses Family",
      dataIndex: ["coursesFamily", "course_family_name"],
      key: "coursesFamily",
      render: (coursesFamilyName: string | undefined) =>
        coursesFamilyName || "N/A",
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthdate",
      key: "birthdate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    // {
    //   title: "Địa chỉ thường trú",
    //   dataIndex: "permanentResidence",
    //   key: "permanentResidence",
    // },
    {
      title: "Chương trình tuyển sinh",
      dataIndex: ["application", "admissionProgram", "name"],
      key: "admissionProgram",
      render: (admissionProgramName: string | undefined) =>
        admissionProgramName || "N/A",
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
    {
      title: "Niên khóa",
      dataIndex: ["cohort", "name"],
      key: "cohort",
      render: (cohortName: string | null) =>
        cohortName ? cohortName : <Tag>N/A</Tag>,
    },
  ];

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <Layout
      className="rounded-lg flex justify-center items-center"
      style={{ background: "white", padding: "10px" }}
    >
      <div className="w-full">
        <Typography.Text type="danger" className="block italic">
          * Vui lòng điền đầy đủ Mã SV cho mỗi sinh viên.
        </Typography.Text>

        <div className="flex justify-between flex-wrap mb-2">
          <TabsMenu tabItems={[]} />
          {/* <ActionButtons
            onNewClick={() => showModal("createStudent")}
            onImportClick={() => showModal("importStudent")}
          /> */}
        </div>

        <FreshmenFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          admissionPrograms={admissionPrograms}
          selectedAdmissionProgram={selectedAdmissionProgram}
          onAdmissionProgramChange={setSelectedAdmissionProgram}
          coursesFamilies={coursesFamilies}
          selectedCoursesFamily={selectedCoursesFamily}
          onCoursesFamilyChange={setSelectedCoursesFamily}
        />

        <StudentTable
          data={filteredStudents}
          columns={columns}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

        {/* <CreateFreshmentForm
          isModalVisible={isVisible("createStudent")}
          hideModal={() => hideModal("createStudent")}
          onCreate={fetchStudents}
        /> */}
        {selectedStudent && (
          <EditStudentForm
            isModalVisible={isVisible("editStudent")}
            hideModal={() => hideModal("editStudent")}
            student={selectedStudent}
            onUpdate={fetchStudents}
          />
        )}
      </div>
    </Layout>
  );
};

export default FreshmenPageList;
