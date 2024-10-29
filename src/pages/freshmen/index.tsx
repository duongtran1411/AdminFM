import { useEffect, useState } from "react";
import Loading from "../../components/common/loading";
import FreshmenTable from "../../components/student/FreshmenTable";
import useModals from "../../hooks/useModal";
import { Freshmen } from "../../models/student.model";
import { studentService } from "../../services/student-service/student.service";
import ViewDocumentModal from "../../components/student/ViewDocumentModal";

const FreshmenPageList = () => {
  const { isVisible, showModal, hideModal } = useModals();
  const [students, setStudents] = useState<Freshmen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Freshmen | null>(null);

  const fetchStudents = async () => {
    try {
      const data = await studentService.findStudentsWithoutClass();
      setStudents(data.data);
    } catch (error) {
      setError("Error loading students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const columns = [
    {
      title: "Mã Sinh Viên",
      dataIndex: "studentId",
      key: "studentId",
    },
    {
      title: "Họ và Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ngày Sinh",
      dataIndex: "birthdate",
      key: "birthdate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Course Family",
      dataIndex: ["coursesFamily", "course_family_name"],
      key: "coursesFamily",
    },
    {
      title: "Hộ khẩu thường chú",
      dataIndex: "permanentResidence",
      key: "permanentResidence",
    },
    {
      title: "Khoá",
      dataIndex: "cohort",
      key: "cohort",
    },
  ];

  const handleViewDocument = (id: number) => {
    const student = students.find((s) => s.id === id);
    if (student) {
      setSelectedStudent(student);
      showModal("viewDocument");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "16px",
          }}
        ></div>

        {/* Freshmen Data Table */}
        <FreshmenTable
          columns={columns}
          data={students}
          onView={handleViewDocument}
        />

        {/* View Document Modal */}
        {selectedStudent && (
          <ViewDocumentModal
            applicationId={selectedStudent.id}
            visible={isVisible("viewDocument")}
            onClose={() => hideModal("viewDocument")}
          />
        )}
      </div>
    </div>
  );
};

export default FreshmenPageList;
