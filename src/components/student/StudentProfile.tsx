import { Avatar, Card, Descriptions, Grid, Spin, Alert } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Student } from "../../models/student.model";
import { studentService } from "../../services/student-service/student.service";
import dayjs from "dayjs";

const { useBreakpoint } = Grid;

const StudentProfile: React.FC = () => {
  const screens = useBreakpoint();
  const { id } = useParams();
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const response = await studentService.findOne(Number(id));
        setStudentData(response.data);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading) {
    return <Spin tip="Loading student information..." />;
  }

  if (!studentData) {
    return <Alert message="No student data found." type="warning" showIcon />;
  }

  return (
    <div className="p-4 h-screen max-w-full mx-auto space-y-4 overflow-auto">
      <h1 className="text-2xl font-bold mb-6">Student Information</h1>

      <div className="flex flex-col md:flex-row items-start gap-4">
        <Avatar size={120} icon={<UserOutlined />} className="bg-blue-500" />

        <div className="flex-1 grid md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          <Card title="Profile" className="w-full">
            <Descriptions
              column={1}
              size={screens.md ? "middle" : "small"}
              layout="horizontal"
              bordered
            >
              <Descriptions.Item label="Full name">
                {studentData.name}
              </Descriptions.Item>
              <Descriptions.Item label="Date of birth">
                {dayjs(studentData.birthdate).format("DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Gender">
                {studentData.gender}
              </Descriptions.Item>
              <Descriptions.Item label="ID Card">N/A</Descriptions.Item>
              <Descriptions.Item label="Address">
                {studentData.permanentResidence}
              </Descriptions.Item>
              <Descriptions.Item label="Phone number">
                {studentData.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                <Link
                  style={{ textDecoration: "underline", color: "blue" }}
                  to={`mailto:${studentData.email}`}
                >
                  {studentData.email}
                </Link>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Academic" className="w-full">
            <Descriptions
              column={1}
              size={screens.md ? "middle" : "small"}
              layout="horizontal"
              bordered
            >
              <Descriptions.Item label="Roll number">
                {studentData.studentId}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {studentData.status}
              </Descriptions.Item>
              <Descriptions.Item label="Major">
                {studentData.coursesFamily?.course_family_name}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Other Information" className="w-full">
            <Descriptions
              column={1}
              size={screens.md ? "middle" : "small"}
              layout="horizontal"
              bordered
            >
              <Descriptions.Item label="Academic Year">
                {/* {studentData.cohort?.academicYear || "N/A"} */}
                N/A
              </Descriptions.Item>
              <Descriptions.Item label="Main Class">
                {studentData.class?.name}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card
            title="Parent Information"
            className="w-full md:col-span-2 lg:col-span-3"
          >
            <Descriptions
              column={screens.md ? 2 : 1}
              size={screens.md ? "middle" : "small"}
              layout="horizontal"
              bordered
            >
              <Descriptions.Item label="Name">
                {studentData.parent?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Phone number">
                {studentData.parent?.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Gender">
                {studentData.parent?.gender}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {studentData.parent?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Job">
                {studentData.parent?.job}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
