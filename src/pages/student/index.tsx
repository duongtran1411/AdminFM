import { Checkbox, Layout, Modal, notification, Tag } from "antd";
import React, { useEffect, useState } from "react";
import Loading from "../../components/common/loading";
import ActionButtons from "../../components/student-in-class/ActionButtons";
import StudentTable from "../../components/student-in-class/StudentInClassTable";
import TabsMenu from "../../components/student-in-class/TabsMenu";
import CreateStudentForm from "../../components/student/CreateStudentForm";
import EditStudentForm from "../../components/student/EditStudentForm";
import useModals from "../../hooks/useModal";
import { Student } from "../../models/student.model";
import { studentService } from "../../services/student-service/student.service";
import { StudentStatus } from "../../models/enum/student.status.enum";

const StudentPage: React.FC = () => {
  const { isVisible, showModal, hideModal } = useModals();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await studentService.findAll();
      setStudents(data.data);
    } catch {
      setError("Error loading students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

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
              students.length === selectedStudentIds.length
                ? []
                : students.map((item) => item.id),
            );
          }}
          checked={students.length === selectedStudentIds.length}
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
      render: (cohortName: string | null) => <Tag>{cohortName || "N/A"}</Tag>,
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
        <div className="flex justify-between flex-wrap">
          <TabsMenu tabItems={[]} />
          <ActionButtons
            onNewClick={() => showModal("createStudent")}
            onImportClick={() => showModal("importExcel")}
          />
        </div>
        <CreateStudentForm
          isModalVisible={isVisible("createStudent")}
          hideModal={() => hideModal("createStudent")}
          onCreate={fetchStudents}
        />
        <StudentTable
          columns={columns}
          data={students}
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
