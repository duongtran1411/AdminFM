import { Modal, notification } from "antd";
import { useEffect, useState } from "react";
import EditFreshmenForm from "../../components/student/EditFreshmenForm";
import FreshmenTable from "../../components/student/FreshmenTable";
import useModals from "../../hooks/useModal";
import { Freshmen } from "../../models/student.model";
import { studentService } from "../../services/student-service/student.service";
import Loading from "../../components/common/loading";

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
      title: "Hộ khẩu thường trú",
      dataIndex: "permanentResidence",
      key: "permanentResidence",
    },
    {
      title: "Khoá",
      dataIndex: "cohort",
      key: "cohort",
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
      showModal("editFreshmen");
    }
  };

  // const onCreateSuccess = () => {
  //   fetchStudents();
  // };

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
        >
          {/* Buttons for adding and importing freshmen */}
          {/* <ActionButtons
            onNewClick={() => showModal("createFreshmen")}
            onImportClick={() => showModal("importExcel")}
          /> */}
        </div>

        {/* Search Input */}
        {/* <Input.Search
          placeholder="Tìm kiếm sinh viên..."
          allowClear
          // onSearch={handleSearch} // Uncomment and implement the search function if needed
          style={{ width: 400, marginBottom: 16 }}
        /> */}

        {/* Create Freshmen modal */}
        {/* <FreshmenCreateForm
          isModalVisible={isVisible("createFreshmen")}
          hideModal={() => hideModal("createFreshmen")}
          onStudentCreated={onCreateSuccess}
        /> */}

        {/* Freshmen Data Table */}
        <FreshmenTable
          columns={columns}
          data={students}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

        {/* Edit Freshmen modal */}
        <EditFreshmenForm
          isModalVisible={isVisible("editFreshmen")}
          hideModal={() => hideModal("editFreshmen")}
          freshmen={selectedStudent}
          onUpdate={onUpdateSuccess}
        />
      </div>
    </div>
  );
};

export default FreshmenPageList;
