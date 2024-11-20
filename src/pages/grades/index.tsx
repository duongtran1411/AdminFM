import {
  Button,
  Card,
  Col,
  InputNumber,
  notification,
  Row,
  Select,
  Table,
  Input,
  Empty,
} from "antd";
import { ColumnType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { Class } from "../../models/classes.model";
import { Module } from "../../models/courses.model";
import { GradeInput } from "../../models/gradecategory.model";
import { Student } from "../../models/student.model";
import classService from "../../services/class-service/class.service";
import { gradeCategoryService } from "../../services/grade-service/grade.category.service";
import { moduleService } from "../../services/module-serice/module.service";
import { studentService } from "../../services/student-service/student.service";
import { SaveOutlined } from "@ant-design/icons";

const GradesPage: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [terms, setTerms] = useState<number[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [gradeData, setGradeData] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [manualFinalGrades, setManualFinalGrades] = useState<{
    [key: number]: number | null;
  }>({});
  const [remarks, setRemarks] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await classService.getClasses();
        setClasses(response.data);
      } catch (error) {
        notification.error({ message: "Error loading classes" });
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      const selectedClassData = classes.find((c) => c.id === selectedClass);
      if (selectedClassData) {
        const termArray = Array.from(
          { length: Math.min(selectedClassData.term_number || 6, 6) },
          (_, i) => i + 1,
        );
        setTerms(termArray);
      }
    } else {
      setTerms([]);
    }
  }, [selectedClass, classes]);

  useEffect(() => {
    const fetchModules = async () => {
      if (selectedClass && selectedTerm) {
        try {
          const response = await moduleService.getModulesByClassAndTerm(
            selectedClass,
            selectedTerm,
          );
          setModules(response.data);
        } catch (error) {
          notification.error({ message: "Error loading modules" });
        }
      } else {
        setModules([]);
      }
    };
    fetchModules();
  }, [selectedClass, selectedTerm]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedClass) {
        try {
          const data = await studentService.findByClassId(+selectedClass);
          setStudents(data.data);
          setGradeData(
            data.data.map((student) => ({
              student: student,
              grades: [],
            })),
          );
        } catch (error) {
          notification.error({ message: "Error loading students" });
        }
      } else {
        setStudents([]);
        setGradeData([]);
      }
    };
    fetchStudents();
  }, [selectedClass]);

  useEffect(() => {
    const fetchGrades = async () => {
      if (selectedModule && students.length > 0) {
        try {
          const gradePromises = students.map((student) =>
            gradeCategoryService.getGradeByModuleAndStudent(
              student.id,
              selectedModule,
            ),
          );
          const gradeResponses = await Promise.all(gradePromises);
          setGradeData(gradeResponses.map((response) => response.data));
        } catch (error) {
          notification.error({ message: "Error loading grades" });
        }
      }
    };
    fetchGrades();
  }, [selectedModule, students]);

  const handleScoreChange = (
    studentId: number,
    gradeComponentId: number,
    newScore: number | null,
  ) => {
    setGradeData((prevData) =>
      prevData.map((studentData) =>
        studentData.student.id === studentId
          ? {
              ...studentData,
              grades: studentData.grades.map((g: any) =>
                g.gradeComponent.id === gradeComponentId
                  ? { ...g, score: newScore }
                  : g,
              ),
            }
          : studentData,
      ),
    );
  };

  const handleFinalGradeChange = (studentId: number, value: number | null) => {
    setManualFinalGrades((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  const handleRemarksChange = (studentId: number, value: string) => {
    setRemarks((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  const handleSubmitGrades = async () => {
    if (!selectedModule) return;
    try {
      setLoading(true);
      const gradesToSubmit: GradeInput[] = [];

      gradeData.forEach((studentData) => {
        studentData.grades.forEach((grade) => {
          gradesToSubmit.push({
            studentId: studentData.student.id,
            moduleId: selectedModule,
            gradeComponentId: grade.gradeComponent.id,
            score: grade.score,
          });
        });

        gradesToSubmit.push({
          studentId: studentData.student.id,
          moduleId: selectedModule,
          average_grade: manualFinalGrades[studentData.student.id] ?? undefined,
          remarks: remarks[studentData.student.id] ?? "",
        });
      });

      if (gradesToSubmit.length === 0) {
        notification.warning({ message: "Không có điểm nào để lưu" });
        return;
      }

      await gradeCategoryService.assignGradesForStudents(gradesToSubmit);
      notification.success({ message: "Lưu điểm thành công" });
    } catch (error) {
      notification.error({ message: "Lỗi khi lưu điểm" });
    } finally {
      setLoading(false);
    }
  };

  const isAllComponentGradesEntered = (studentData: any) => {
    if (!studentData.grades || studentData.grades.length === 0) return false;
    return studentData.grades.every(
      (grade: any) => grade.score !== null && grade.score !== undefined,
    );
  };

  const getGradeColumns = () => {
    const columns: ColumnType<any>[] = [
      {
        title: "Mã SV",
        dataIndex: ["student", "studentId"],
        key: "studentId",
        fixed: "left",
        width: 120,
        align: "center",
      },
      {
        title: "Họ tên",
        dataIndex: ["student", "name"],
        key: "name",
        fixed: "left",
        width: 200,
      },
    ];

    if (selectedModule && gradeData.length > 0 && gradeData[0].grades) {
      const gradeComponentColumns = gradeData[0].grades.map((grade) => {
        const weight = parseFloat(grade.gradeComponent.gradeCategory.weight);
        const formattedWeight = Number.isInteger(weight)
          ? `${weight}%`
          : `${weight.toFixed(1)}%`;

        return {
          title: (
            <div style={{ textAlign: "center" }}>
              <div>{grade.gradeComponent.name}</div>
              <div style={{ color: "#666", fontSize: "12px" }}>
                ({formattedWeight})
              </div>
            </div>
          ),
          key: `grade-${grade.gradeComponent.id}`,
          width: 120,
          align: "center" as const,
          render: (_, record) => {
            const gradeItem = record.grades.find(
              (g: any) => g.gradeComponent.id === grade.gradeComponent.id,
            );
            return (
              <InputNumber
                value={gradeItem?.score || null}
                onChange={(value) =>
                  handleScoreChange(
                    record.student.id,
                    grade.gradeComponent.id,
                    value,
                  )
                }
                style={{ width: "90%" }}
                min={0}
                max={10}
                step={0.1}
                placeholder="Nhập điểm"
                size="middle"
                className="grade-input"
              />
            );
          },
        };
      });

      columns.push(...gradeComponentColumns);

      columns.push(
        {
          title: (
            <div style={{ textAlign: "center" }}>
              <div>Điểm tổng kết</div>
            </div>
          ),
          key: "finalGrade",
          width: 120,
          fixed: "right",
          align: "center",
          render: (_, record) => (
            <InputNumber
              value={manualFinalGrades[record.student.id] ?? null}
              onChange={(value) =>
                handleFinalGradeChange(record.student.id, value)
              }
              style={{ width: "90%" }}
              min={0}
              max={10}
              step={0.1}
              placeholder="Điểm TK"
              size="middle"
              className="final-grade-input"
              disabled={!isAllComponentGradesEntered(record)}
            />
          ),
        },
        {
          title: "Ghi chú",
          key: "remarks",
          width: 200,
          fixed: "right",
          render: (_, record) => (
            <Input
              value={remarks[record.student.id] ?? ""}
              onChange={(e) =>
                handleRemarksChange(record.student.id, e.target.value)
              }
              placeholder="Nhập ghi chú"
              size="middle"
              className="remarks-input"
              disabled={!isAllComponentGradesEntered(record)}
              title={
                !isAllComponentGradesEntered(record)
                  ? "Vui lòng nhập đủ các điểm thành phần trước"
                  : ""
              }
            />
          ),
        },
      );
    }

    return columns;
  };

  return (
    <div style={{ padding: "24px" }}>
      <Card title="Quản lý điểm sinh viên" bordered={false}>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={24} md={8}>
            <div className="select-label">Lớp học:</div>
            <Select
              style={{ width: "100%" }}
              placeholder="Chọn lớp học"
              onChange={(value) => setSelectedClass(value)}
              options={classes.map((c) => ({ label: c.name, value: c.id }))}
              size="large"
              showSearch
              optionFilterProp="label"
              className="custom-select"
            />
          </Col>
          <Col xs={24} sm={24} md={8}>
            <div className="select-label">Học kỳ:</div>
            <Select
              style={{ width: "100%" }}
              placeholder="Chọn học kỳ"
              disabled={!selectedClass}
              onChange={(value) => setSelectedTerm(value)}
              options={terms.map((term) => ({
                label: `Học kỳ ${term}`,
                value: term,
              }))}
              size="large"
              className="custom-select"
            />
          </Col>
          <Col xs={24} sm={24} md={8}>
            <div className="select-label">Môn học:</div>
            <Select
              style={{ width: "100%" }}
              placeholder="Chọn môn học"
              disabled={!selectedTerm}
              onChange={(value) => setSelectedModule(value)}
              options={modules.map((m) => ({
                label: `${m.module_name} (${m.code})`,
                value: m.module_id,
              }))}
              size="large"
              showSearch
              optionFilterProp="label"
              className="custom-select"
            />
          </Col>
        </Row>

        {selectedModule && (
          <div style={{ marginBottom: 16, textAlign: "right" }}>
            <Button
              type="primary"
              onClick={handleSubmitGrades}
              loading={loading}
              icon={<SaveOutlined />}
              size="large"
            >
              Lưu điểm
            </Button>
          </div>
        )}

        <Card
          className="table-card"
          bordered={false}
          style={{
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
            borderRadius: 8,
          }}
        >
          {!selectedClass ? (
            <Empty
              description={
                <span>Vui lòng chọn lớp học để xem danh sách sinh viên</span>
              }
            />
          ) : (
            <Table
              dataSource={gradeData}
              columns={getGradeColumns()}
              scroll={{ x: "max-content", y: "calc(100vh - 380px)" }}
              pagination={false}
              bordered
              rowKey={(record) => record.student?.id || "fallback"}
              loading={loading}
              size="middle"
              className="grades-table"
            />
          )}
        </Card>
      </Card>
    </div>
  );
};

export default GradesPage;
