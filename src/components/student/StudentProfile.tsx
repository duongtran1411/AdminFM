import {
  DeleteOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Card,
  Descriptions,
  Grid,
  Spin,
  Upload,
  Image,
  message,
  Button,
} from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile } from "antd/es/upload/interface";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiEndpoint } from "../../config";
import { Student } from "../../models/student.model";
import { studentService } from "../../services/student-service/student.service";

const { useBreakpoint } = Grid;

const StudentProfile: React.FC = () => {
  const screens = useBreakpoint();
  const { id } = useParams();
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

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

  const handleAvatarUpload = async (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === "uploading") {
      setUploading(true);
      return;
    }

    if (info.file.status === "done") {
      try {
        const response = await studentService.uploadAvatar(
          Number(id),
          info.file.originFileObj as File,
        );
        setStudentData((prev) =>
          prev ? { ...prev, avatar: response.data.avatarUrl } : null,
        );
        message.success("Ảnh đã được tải lên thành công");
      } catch (error) {
        message.error("Không thể tải lên ảnh");
      } finally {
        setUploading(false);
      }
    }

    if (info.file.status === "error") {
      message.error("Không thể tải lên ảnh");
      setUploading(false);
    }
  };

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Bạn chỉ có thể upload file JPG/PNG!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Ảnh phải nhỏ hơn 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleDeleteAvatar = async () => {
    try {
      await studentService.deleteAvatar(Number(id));
      setStudentData((prev) => (prev ? { ...prev, avatar: undefined } : null));
      message.success("Ảnh đã được xóa thành công");
    } catch (error) {
      message.error("Không thể xóa ảnh");
    }
  };

  const AvatarSection = (
    <div className="flex flex-col items-center gap-4">
      <div className="w-[120px] h-[120px] relative group">
        {studentData?.avatar ? (
          <Image
            src={`${apiEndpoint}${studentData.avatar}`}
            alt="Avatar"
            width={120}
            height={120}
            className="rounded-full object-cover border-2 border-gray-200"
            preview={{
              maskClassName: "rounded-full",
              mask: <div className="rounded-full">Click to preview</div>,
            }}
          />
        ) : (
          <Avatar
            size={120}
            icon={<UserOutlined />}
            className="w-full h-full bg-blue-500"
          />
        )}

        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Upload
            name="avatar"
            showUploadList={false}
            customRequest={({ onSuccess }) => {
              setTimeout(() => {
                onSuccess?.("ok");
              }, 0);
            }}
            beforeUpload={beforeUpload}
            onChange={handleAvatarUpload}
            disabled={uploading}
          >
            <Button
              className="flex items-center !px-3 !py-1 text-sm h-full hover:bg-blue-600"
              disabled={uploading}
              icon={uploading ? <Spin size="small" /> : <UploadOutlined />}
            ></Button>
          </Upload>

          {studentData?.avatar && (
            <Button
              danger
              className="flex items-center !px-3 !py-1 text-sm h-full hover:bg-red-600"
              onClick={handleDeleteAvatar}
              icon={<DeleteOutlined />}
            ></Button>
          )}
        </div>
      </div>
    </div>
  );

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
        {AvatarSection}

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
              <Descriptions.Item label="ID Card">
                {studentData.cardId}
              </Descriptions.Item>
              <Descriptions.Item label="Date of birth">
                {dayjs(studentData.birthdate).format("DD/MM/YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Gender">
                {studentData.gender}
              </Descriptions.Item>
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
              <Descriptions.Item label="Academic Year">N/A</Descriptions.Item>
              <Descriptions.Item label="Main Class">
                {studentData.class?.name}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card
            title="Parent Information"
            className="w-full md:col-span-2 lg:col-span-3"
          >
            {studentData.parent && studentData.parent.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {studentData.parent.map((parent) => (
                  <Descriptions
                    key={parent.id}
                    column={1}
                    size={screens.md ? "middle" : "small"}
                    layout="horizontal"
                    bordered
                  >
                    <Descriptions.Item label="Name">
                      {parent.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phone number">
                      {parent.phone}
                    </Descriptions.Item>
                    <Descriptions.Item label="Gender">
                      {parent.gender}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      <Link
                        style={{ textDecoration: "underline", color: "blue" }}
                        to={`mailto:${parent.email}`}
                      >
                        {parent.email}
                      </Link>
                    </Descriptions.Item>
                    <Descriptions.Item label="Job">
                      {parent.job}
                    </Descriptions.Item>
                  </Descriptions>
                ))}
              </div>
            ) : (
              <Alert
                message="No parent information available."
                type="info"
                showIcon
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
