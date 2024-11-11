import { Checkbox, Layout, Modal, notification, Tag } from "antd";
import React, { useEffect, useState } from "react";
import Loading from "../../components/common/loading";
import ActionButtons from "../../components/student-in-class/ActionButtons";
import StudentTable from "../../components/student-in-class/StudentInClassTable";
import AddToClassButton from "../../components/student/AddToClassButtom";
import CreateStudentForm from "../../components/student/CreateStudentForm";
import EditStudentForm from "../../components/student/EditStudentForm";
import StudentFilter from "../../components/student/StudentFilter";
import useModals from "../../hooks/useModal";
import { StudentStatus } from "../../models/enum/student.status.enum";
import { Student } from "../../models/student.model";
import { studentService } from "../../services/student-service/student.service";
import { useNavigate } from "react-router-dom";

const StudentPage: React.FC = () => {
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
  const [statuses] = useState<string[]>(Object.values(StudentStatus));
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await studentService.findAll();
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
      setCoursesFamilies(families);
    } catch {
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

    if (selectedStatus) {
      result = result.filter((student) => student.status === selectedStatus);
    }

    setFilteredStudents(result);
  }, [
    students,
    searchTerm,
    selectedAdmissionProgram,
    selectedCoursesFamily,
    selectedStatus,
  ]);

  const handleSelect = (id: number) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((key) => key !== id) : [...prev, id],
    );
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xoá sinh viên này không?",
      okText: "Xoá",
      okType: "danger",
      onOk: async () => {
        try {
          await studentService.remove(id);
          setStudents((prev) => prev.filter((student) => student.id !== id));
          notification.success({ message: "Xoá sinh viên thành công" });
        } catch {
          notification.error({ message: "Lỗi xoá sinh viên" });
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
      render: (studentId: string | null, record: Student) => (
        <Tag
          color="blue"
          onClick={() => navigate(`/student/${record.id}`)}
          style={{ cursor: "pointer", textDecoration: "underline" }}
        >
          {studentId || "N/A"}
        </Tag>
      ),
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
      title: "Lớp",
      dataIndex: ["class", "name"],
      key: "class",
      render: (className: string | null) =>
        className ? className : <Tag>N/A</Tag>,
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
      style={{ background: "white", padding: "20px" }}
    >
      <div className="w-full">
        <div className="flex justify-end space-x-2">
          {selectedStudentIds.length > 0 && (
            <AddToClassButton
              onChangeStatusClick={() => showModal("addToClass")}
            />
          )}
          <ActionButtons
            onNewClick={() => showModal("createStudent")}
            onImportClick={() => showModal("importExcel")}
          />
        </div>

        <StudentFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          admissionPrograms={admissionPrograms}
          selectedAdmissionProgram={selectedAdmissionProgram}
          onAdmissionProgramChange={setSelectedAdmissionProgram}
          coursesFamilies={coursesFamilies}
          selectedCoursesFamily={selectedCoursesFamily}
          onCoursesFamilyChange={setSelectedCoursesFamily}
          statuses={statuses}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />

        <CreateStudentForm
          isModalVisible={isVisible("createStudent")}
          hideModal={() => hideModal("createStudent")}
          onCreate={fetchStudents}
        />
        <StudentTable
          columns={columns}
          data={filteredStudents}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
      <EditStudentForm
        isModalVisible={isVisible("editStudent")}
        hideModal={() => hideModal("editStudent")}
        student={selectedStudent}
        onUpdate={fetchStudents}
      />
    </Layout>
  );
};

export default StudentPage;
