"use client";

import {
  BookOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Space,
  theme,
  Typography,
} from "antd";
import * as jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { studentService } from "../../services/student-service/student.service";
import { Student } from "../../models/student.model";

const { Title, Text } = Typography;

function getStudentIdFromToken(): number | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded: any = jwt_decode.jwtDecode(token);
    return decoded.sub; // Assuming 'sub' contains the userId
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

export default function CourseRegistrationForm() {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [checkPassResult, setCheckPassResult] = useState<string | null>(null);
  const [student, setStudent] = useState<Student | null>(null);

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
    const moduleCode = form.getFieldValue("subjectCode");

    const studentId = student?.id;
    if (!studentId) {
      console.error("Student ID not found in token");
      return;
    }

    try {
      const response = await studentService.checkPass(moduleCode, studentId);
      setCheckPassResult(response.data.data);
    } catch (error) {
      console.error("Error checking pass status:", error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: token.colorBgLayout,
        padding: "24px",
      }}
    >
      <Card
        style={{
          maxWidth: 800,
          margin: "0 auto",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Header */}
          <div>
            <Title level={2} style={{ marginBottom: 8 }}>
              <BookOutlined /> Đăng ký học lại
            </Title>
            <Text type="secondary">
              <CalendarOutlined /> Thời gian đăng ký: {registrationPeriod.start}{" "}
              - {registrationPeriod.end}
            </Text>
          </div>

          {/* Notice Banner */}
          <Alert
            type="warning"
            showIcon
            message="Lưu ý quan trọng"
            description="Sinh viên đăng ký học lại ngay trong kỳ học trọng kỳ tiếp theo được áp dụng phí học lại bằng 50% biểu phí môn"
          />

          <Form form={form} layout="vertical" size="large">
            {/* Module Code Input */}
            <Form.Item
              label="Mã môn học (Module Code)"
              name="subjectCode"
              required
            >
              <Input placeholder="Ví dụ: LAB211" />
            </Form.Item>

            {/* Action Buttons */}
            <Form.Item style={{ marginTop: 24 }}>
              <Space
                size="middle"
                style={{ width: "100%", justifyContent: "center" }}
              >
                <Button type="primary" size="large" onClick={handleCheckPass}>
                  Kiểm tra trạng thái
                </Button>
                <Button size="large" danger>
                  Hủy
                </Button>
              </Space>
            </Form.Item>
          </Form>

          {/* Check Pass Result */}
          {checkPassResult && (
            <Alert
              message="Kết quả kiểm tra"
              description={checkPassResult}
              type="info"
              showIcon
            />
          )}

          {/* Footer */}
          <div style={{ textAlign: "center" }}>
            <Space direction="vertical" size="small">
              <Text type="secondary">
                <InfoCircleOutlined /> Phòng dịch vụ sinh viên: Email:
                dichvusinhvien@fe.edu.vn
              </Text>
              <Text type="secondary">Điện thoại: (024)7308.13.13</Text>
            </Space>
          </div>
        </Space>
      </Card>
    </div>
  );
}
