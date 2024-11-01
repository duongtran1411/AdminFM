import { Layout, Modal, notification, Tag } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../components/common/loading";
import ActionButtons from "../../components/student-in-class/ActionButtons";
import AddStudentToClassForm from "../../components/student-in-class/AddStudentToClassForm";
import StudentInClassTable from "../../components/student-in-class/StudentInClassTable";
import TabsMenu from "../../components/student-in-class/TabsMenu";
import EditStudentForm from "../../components/student/EditStudentForm";
import useModals from "../../hooks/useModal";
import { Student } from "../../models/student.model";
import { studentService } from "../../services/student-service/student.service";

const StudentInClassPage = () => {
  const { isVisible, showModal, hideModal } = useModals();
  const { classId } = useParams();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await studentService.findByClassId(classId);
      setStudents(data.data);
    } catch (error) {
      setError("Error loading students");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStudents();
  }, [classId]);

  const columns = [
    {
      title: "Mã SV",
      dataIndex: "studentId",
      key: "studentId",
      render: (studentId: number | null) =>
        studentId ? studentId : <Tag>N/A</Tag>,
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
  ];

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this student?",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await studentService.remove(id);
          setStudents(students.filter((student) => student.id !== id));
          notification.success({ message: "Student deleted successfully" });
        } catch (error) {
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

  const onCreateSuccess = () => {
    fetchStudents();
  };

  const onUpdateSuccess = () => {
    fetchStudents();
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Layout
      className="rounded-lg flex justify-center items-center"
      style={{
        background: "white",
        padding: "20px",
      }}
    >
      <div className="w-full ">
        <div className="flex justify-between flex-wrap">
          <TabsMenu tabItems={[]} />
          <ActionButtons
            onNewClick={() => showModal("createStudent")}
            onImportClick={() => showModal("importExcel")}
          />
        </div>
        <AddStudentToClassForm
          isModalVisible={isVisible("createStudent")}
          hideModal={() => hideModal("createStudent")}
          onStudentCreated={onCreateSuccess}
          classId={classId}
        />
        <StudentInClassTable
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
        onUpdate={onUpdateSuccess}
      />
    </Layout>
  );
};

export default StudentInClassPage;
