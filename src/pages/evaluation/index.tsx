import {
  Button,
  Checkbox,
  Input,
  Layout,
  Modal,
  notification,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import Loading from "../../components/common/loading";
import NavigateBack from "../../components/shared/NavigateBack";
import { EvaluationLevel } from "../../models/enum/evaluation.level.enum";
import { Student } from "../../models/student.model";
import { studentService } from "../../services/student-service/student.service";
import evaluationService from "../../services/evaluation-service/evaluation.service";

const EvaluationPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudentsByClass = async () => {
    try {
      const response = await studentService.findAll();
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentsByClass();
  }, []);

  const handleCheckboxChange = (studentId: number, level: EvaluationLevel) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) => {
        if (student.id === studentId) {
          return {
            ...student,
            evaluation: [
              {
                ...student.evaluation?.[0],
                level:
                  student.evaluation?.[0]?.level === level ? undefined : level,
              },
            ],
          };
        }
        return student;
      }),
    );
  };

  const handleCommentChange = (studentId: number, comment: string) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) => {
        if (student.id === studentId) {
          return {
            ...student,
            evaluation: [
              {
                ...student.evaluation?.[0],
                comments: comment,
              },
            ],
          };
        }
        return student;
      }),
    );
  };

  const handleSubmit = () => {
    Modal.confirm({
      title: "Xác nhận lưu đánh giá",
      content: "Bạn có chắc chắn muốn lưu đánh giá này?",
      onOk: async () => {
        try {
          const evaluationsToSubmit = students
            .filter((student) => student.evaluation?.[0]?.level)
            .map((student) => ({
              studentId: student.id,
              level: student.evaluation?.[0]?.level,
              comments: student.evaluation?.[0]?.comments || "",
            }));

          await evaluationService.createOrUpdateMultiple({
            evaluations: evaluationsToSubmit,
          });

          notification.success({
            message: "Lưu đánh giá thành công!",
          });
        } catch (error) {
          notification.error({
            message: "Lỗi khi lưu đánh giá!",
            description: "Vui lòng thử lại sau.",
          });
        }
      },
    });
  };

  const columns = [
    {
      title: "Mã Sinh Viên",
      dataIndex: "studentId",
      key: "studentId",
      width: "15%",
      render: (studentId: string | null) => (studentId ? studentId : "N/A"),
    },
    {
      title: "Họ và Tên",
      dataIndex: "name",
      key: "name",
      width: "20%",
    },
    {
      title: EvaluationLevel.EXCELLENT,
      key: "excellent",
      width: "12%",
      render: (_: any, record: Student) => (
        <Checkbox
          checked={record.evaluation?.[0]?.level === EvaluationLevel.EXCELLENT}
          onChange={() =>
            handleCheckboxChange(record.id, EvaluationLevel.EXCELLENT)
          }
        />
      ),
    },
    {
      title: EvaluationLevel.GOOD,
      key: "good",
      width: "12%",
      render: (_: any, record: Student) => (
        <Checkbox
          checked={record.evaluation?.[0]?.level === EvaluationLevel.GOOD}
          onChange={() => handleCheckboxChange(record.id, EvaluationLevel.GOOD)}
        />
      ),
    },
    {
      title: EvaluationLevel.AVERAGE,
      key: "average",
      width: "12%",
      render: (_: any, record: Student) => (
        <Checkbox
          checked={record.evaluation?.[0]?.level === EvaluationLevel.AVERAGE}
          onChange={() =>
            handleCheckboxChange(record.id, EvaluationLevel.AVERAGE)
          }
        />
      ),
    },
    {
      title: EvaluationLevel.POOR,
      key: "poor",
      width: "12%",
      render: (_: any, record: Student) => (
        <Checkbox
          checked={record.evaluation?.[0]?.level === EvaluationLevel.POOR}
          onChange={() => handleCheckboxChange(record.id, EvaluationLevel.POOR)}
        />
      ),
    },
    {
      title: "Nhận xét",
      key: "comments",
      width: "17%",
      render: (_: any, record: Student) => (
        <Input
          value={record.evaluation?.[0]?.comments}
          onChange={(e) => handleCommentChange(record.id, e.target.value)}
          placeholder="Nhập nhận xét..."
        />
      ),
    },
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <Layout
      className="rounded-lg"
      style={{
        background: "white",
        padding: "20px",
        position: "relative",
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          overflowX: "auto",
        }}
      >
        <NavigateBack />
        <Table
          columns={columns}
          dataSource={students}
          pagination={false}
          style={{ width: "100%" }}
        />
        <div className="flex justify-end mt-4">
          <Button type="primary" onClick={handleSubmit}>
            Lưu đánh giá
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default EvaluationPage;
