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
      console.log(data);
    } catch (error) {
      console.error("Lỗi khi lấy trạng thái điểm danh", error);
      setError("Failed to load attendance status.");
    }
  };

  useEffect(() => {
    // fetchStudents();
    fetchAttendanceStatus(scheduleId!);
    // Ensure scheduleId is correctly defined or passed
  }, [scheduleId]); // Combine dependencies in the same array
  const columns = [
    {
      title: "Mã Sinh Viên",
      dataIndex: "studentId",
      key: "studentId",
    },
    {
      title: "Tên",
      dataIndex: "studentName",
      key: "studentName",
    },
    {
      title: "Trạng Thái Điểm Danh",
      dataIndex: "isChecked",
      key: "isChecked",
      render: (_: any, record: AttendanceStatus) => (
        <span
          className={`${
            record.isChecked
              ? "text-green-600" // Present
              : record.isChecked === false
              ? "text-red-600" // Absent
              : "text-gray-600" // Not marked
          }`}
        >
          {record.isChecked ? "Có mặt" : "Vắng mặt"}
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
