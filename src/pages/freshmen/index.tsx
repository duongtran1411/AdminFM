import { useEffect, useState } from "react";
import Loading from "../../components/common/loading";
import FreshmenTable from "../../components/student/FreshmenTable";
import { Freshmen } from "../../models/student.model";
import { studentService } from "../../services/student-service/student.service";

const FreshmenPageList = () => {
  const [students, setStudents] = useState<Freshmen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        <FreshmenTable columns={columns} data={students} />
      </div>
    </div>
  );
};

export default FreshmenPageList;
