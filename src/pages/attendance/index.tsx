import { Layout, Table } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AttendanceStatus,
  getAttendanceStatus,
} from "../../services/attendence-service/attendence.service";
import Loading from "../../components/common/loading";

const AttendancePage = () => {
  const [error, setError] = useState("");
  const [attendanceData, setAttendanceData] = useState<AttendanceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const { scheduleId } = useParams();

  const fetchAttendanceStatus = async (scheduleId: string) => {
    try {
      setLoading(true);
      const data = await getAttendanceStatus(scheduleId);
      console.log(data);
      setAttendanceData(data.attendances);
    } catch (error) {
      console.error("Lỗi khi lấy trạng thái điểm danh", error);
      setError("Failed to load attendance status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceStatus(scheduleId!);
  }, [scheduleId]);

  const columns = [
    {
      title: "Mã Sinh Viên",
      dataIndex: ["student", "studentId"],
      key: "studentId",
    },
    {
      title: "Tên",
      dataIndex: ["student", "name"],
      key: "name",
    },
    {
      title: "Trạng Thái Điểm Danh",
      dataIndex: "status",
      key: "status",
      render: (status: number) => {
        let text = "";
        let className = "";
        switch (status) {
          case 1:
            text = "Đi học";
            className = "text-green-600";
            break;
          case 2:
            text = "Đi muộn";
            className = "text-yellow-600";
            break;
          case 3:
            text = "Nghỉ CP";
            className = "text-blue-600";
            break;
          case 4:
            text = "Nghỉ KP";
            className = "text-red-600";
            break;
          default:
            text = "Không xác định";
            className = "text-gray-600";
        }
        return <span className={className}>{text}</span>;
      },
    },
  ];

  // const onCreateSuccess = () => {
  //   fetchStudents();
  // };

  // const onUpdateSuccess = () => {
  //   fetchStudents();
  // };

  // if (loading) {
  //   return <p>Đang tải danh sách sinh viên...</p>;
  // }

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
        minHeight: "100vh",
      }}
    >
      <div className="w-full max-w-6xl">
        <div className="flex justify-between flex-wrap">
          {/* <TabsMenu tabItems={[]} />
          <ActionButtons
            onNewAiClick={() => showModal("createStudent")}
            onImportClick={() => showModal("importExcel")}
          /> */}
        </div>
        {/* <CreateStudentForm
          isModalVisible={isVisible("createStudent")}
          hideModal={() => hideModal("createStudent")}
          onStudentCreated={onCreateSuccess}
        /> */}
        <Table columns={columns} dataSource={attendanceData} />
      </div>
      {/* <EditStudentForm
        isModalVisible={isVisible("editStudent")}
        hideModal={() => hideModal("editStudent")}
        student={selectedStudent}
        onUpdate={onUpdateSuccess}
      /> */}
    </Layout>
  );
};

export default AttendancePage;
