import { Layout, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ActionButtons from "../../components/student/ActionButtons";
import CreateStudentForm from "../../components/student/CreateStudentForm";
import EditStudentForm from "../../components/student/EditStudentForm";
import StudentTable from "../../components/student/StudentTable";
import TabsMenu from "../../components/student/TabsMenu";
import useModals from "../../hooks/useModal";
import { studentService } from "../../services/student-service/student.service";
import { Student } from "../../models/student.model";
import Loading from "../../components/common/loading";

const StudentPage = () => {
  const { isVisible, showModal, hideModal } = useModals();
  const { classId } = useParams();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await studentService.findAll(classId);
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
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthdate",
      key: "birthdate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Lớp",
      dataIndex: ["class", "name"], // Assuming class has a 'name' field
      key: "class",
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
        <CreateStudentForm
          isModalVisible={isVisible("createStudent")}
          hideModal={() => hideModal("createStudent")}
          onStudentCreated={onCreateSuccess} 
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
        onUpdate={onUpdateSuccess}
      />
    </Layout>
  );
};

export default StudentPage;
