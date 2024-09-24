import { Layout, Table } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AttendanceStatus,
  getAttendanceStatus,
} from "../../services/attendence-service/attendence.service";

const AttendancePage = () => {
  const [error, setError] = useState("");
  const [attendanceData, setAttendanceData] = useState<AttendanceStatus[]>([]);
  const { scheduleId } = useParams();

  const fetchAttendanceStatus = async (scheduleId: string) => {
    try {
      const data = await getAttendanceStatus(scheduleId);
      setAttendanceData(data);
    } catch (error) {
      console.error("Lỗi khi lấy trạng thái điểm danh", error);
      setError("Failed to load attendance status.");
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
      render: (status: number) => (
        <span className={`${status === 1 ? "text-green-600" : "text-red-600"}`}>
          {status === 1 ? "Có mặt" : "Vắng mặt"}
        </span>
      ),
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
