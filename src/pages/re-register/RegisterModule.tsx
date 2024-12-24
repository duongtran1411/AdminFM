"use client";

import {
  BookOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  notification,
  Space,
  Table,
  Tag,
  theme,
  Typography,
} from "antd";
import * as jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { StudentResit } from "../../models/student-resit.model";
import { Student } from "../../models/student.model";
import studentResitService from "../../services/student-resit-service/student.resit.service";
import { studentService } from "../../services/student-service/student.service";
import { moduleService } from "../../services/module-serice/module.service";

const { Title, Text } = Typography;

function getStudentIdFromToken(): number | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded: any = jwt_decode.jwtDecode(token);
    return decoded.sub;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

interface AvailableClass {
  classId: number;
  className: string;
}

export default function CourseRegistrationForm() {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [availableClasses, setAvailableClasses] = useState<AvailableClass[]>(
    [],
  );
  const [selectedClass, setSelectedClass] = useState<number | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      const userId = getStudentIdFromToken();
      if (userId) {
        try {
          const studentData = await studentService.findStudentByUserId(userId);
          setStudent(studentData);
        } catch (error) {
          console.error("Failed to fetch student data:", error);
        }
      }
    };

    fetchStudent();
  }, []);

  const registrationPeriod = {
    start: "09:00 ngày 16/12/2024",
    end: "23:59 ngày 28/12/2024",
  };

  const handleCheckPass = async () => {
    const moduleCode = form.getFieldValue("code")?.trim().toUpperCase();
    if (!moduleCode) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng nhập mã môn học",
      });
      return;
    }

    const studentId = student?.id;
    if (!studentId) {
      console.error("Student ID not found");
      return;
    }

    setLoading(true);
    try {
      const response = await studentService.checkPass(moduleCode, studentId);
      if (response.data.length > 0) {
        notification.info({
          message: "Thông báo",
          description: response.message,
        });
      } else {
        notification.warning({
          message: "Cảnh báo",
          description: response.message,
        });
      }
      setAvailableClasses(response.data);
      setSelectedClass(null);
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi kiểm tra trạng thái môn học",
      });
      setAvailableClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!selectedClass || !student?.id) {
      notification.error({
        message: "Lỗi",
        description:
          "Vui lòng chọn lớp học và đảm bảo thông tin sinh viên hợp lệ",
      });
      return;
    }

    const moduleCode = form.getFieldValue("code")?.trim().toUpperCase();
    if (!moduleCode) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng nhập mã môn học",
      });
      return;
    }

    try {
      // Get module information first
      const moduleResponse = await moduleService.getModulesByCode(moduleCode);
      const moduleId = moduleResponse.data.module_id;

      const studentResit: StudentResit = {
        studentId: student.id,
        classId: selectedClass,
        moduleId: moduleId,
      };

      await studentResitService.add(studentResit);
      notification.success({
        message: "Thành công",
        description: "Đăng ký học lại thành công",
      });

      setSelectedClass(null);
      setAvailableClasses([]);
      form.resetFields();
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi đăng ký học lại",
      });
    }
  };

  const columns = [
    {
      title: "Mã lớp",
      dataIndex: "className",
      key: "className",
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Hành động",
      key: "action",
      align: "center" as const,
      render: (_: any, record: AvailableClass) => (
        <Space>
          {selectedClass === record.classId ? (
            <>
              <Button
                type="primary"
                style={{ backgroundColor: "gray" }}
                onClick={() => setSelectedClass(null)}
              >
                Huỷ chọn
              </Button>
            </>
          ) : (
            <Button
              type="primary"
              onClick={() => setSelectedClass(record.classId)}
              disabled={selectedClass !== null}
            >
              Chọn lớp
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: "24px",
        background: token.colorBgLayout,
        minHeight: "100vh",
      }}
    >
      <Card
        bordered={false}
        style={{ maxWidth: "90%", margin: "0 auto", borderRadius: 8 }}
      >
        <Space
          direction="vertical"
          size="large"
          style={{ width: "100%", flexDirection: "column" }}
        >
          {/* Header */}
          <div style={{ textAlign: "center" }}>
            <Title level={2} style={{ marginBottom: 8 }}>
              <BookOutlined /> Đăng ký học lại
            </Title>
            <Text type="secondary">
              <CalendarOutlined /> Thời gian đăng ký: {registrationPeriod.start}{" "}
              - {registrationPeriod.end}
            </Text>
          </div>

          {/* Search Form */}
          <Form form={form} layout="vertical">
            <Form.Item
              label="Mã môn học"
              name="code"
              required
              rules={[{ required: true, message: "Vui lòng nhập mã môn học" }]}
            >
              <Input.Search
                placeholder="Ví dụ: CSI104"
                enterButton={
                  <Button type="primary" icon={<SearchOutlined />}>
                    Kiểm tra
                  </Button>
                }
                size="large"
                loading={loading}
                onSearch={handleCheckPass}
              />
            </Form.Item>
          </Form>

          {/* Available Classes */}
          {availableClasses.length > 0 && (
            <>
              <Title level={4}>Danh sách lớp có thể đăng ký:</Title>
              <Table
                columns={columns}
                dataSource={availableClasses}
                rowKey="classId"
                pagination={false}
                bordered
              />
              <Button
                type="primary"
                size="large"
                block
                disabled={!selectedClass}
                onClick={handleRegister}
                style={{ marginTop: 16 }}
              >
                Xác nhận đăng ký học lại
              </Button>
            </>
          )}

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Space direction="vertical" size="small">
              <Text type="secondary">
                <InfoCircleOutlined /> Phòng dịch vụ sinh viên
              </Text>
              <Text type="secondary">Email: dichvusinhvien@gmail.com</Text>
              <Text type="secondary">Điện thoại: (024)1313.13.13</Text>
            </Space>
          </div>
        </Space>
      </Card>
    </div>
  );
}
