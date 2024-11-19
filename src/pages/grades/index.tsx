import {
  Button,
  Card,
  Col,
  InputNumber,
  notification,
  Row,
  Select,
  Table,
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

  const handleSubmitGrades = async () => {
    if (!selectedModule) return;
    try {
      setLoading(true);
      const gradesToSubmit: GradeInput[] = [];

      gradeData.forEach((studentData) => {
        studentData.grades.forEach((grade) => {
          if (grade.score !== null) {
            gradesToSubmit.push({
              studentId: studentData.student.id,
              moduleId: selectedModule,
              gradeComponentId: grade.gradeComponent.id,
              score: grade.score,
            });
          }
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

  const getGradeColumns = () => {
    const columns: ColumnType<any>[] = [
      {
        title: "Mã SV",
        dataIndex: ["student", "studentId"],
        key: "studentId",
        fixed: "left",
        width: 100,
      },
      {
        title: "Họ tên",
        dataIndex: ["student", "name"],
        key: "name",
        fixed: "left",
        width: 200,
      },
    ];

    if (gradeData.length > 0 && gradeData[0].grades) {
      gradeData[0].grades.forEach((grade) => {
        const weight = parseFloat(grade.gradeComponent.gradeCategory.weight);
        const formattedWeight = Number.isInteger(weight)
          ? `${weight}%`
          : `${weight.toFixed(1)}%`;

        columns.push({
          title: `${grade.gradeComponent.name} (${formattedWeight})`,
          key: `grade-${grade.gradeComponent.id}`,
          width: 200,
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
                style={{ width: "100%" }}
                min={0}
                max={10}
                step={0.1}
                placeholder="Nhập điểm"
              />
            );
          },
        });
      });
    }

    return columns;
  };

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={24} md={8}>
              <Select
                style={{ width: "100%" }}
                placeholder="Chọn lớp học"
                onChange={(value) => setSelectedClass(value)}
                options={classes.map((c) => ({ label: c.name, value: c.id }))}
                size="large"
                showSearch
                optionFilterProp="label"
              />
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Select
                style={{ width: "100%" }}
                placeholder="Chọn học kỳ"
                disabled={!selectedClass}
                onChange={(value) => setSelectedTerm(value)}
                options={terms.map((term) => ({
                  label: `Kỳ ${term}`,
                  value: term,
                }))}
                size="large"
              />
            </Col>
            <Col xs={24} sm={24} md={8}>
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
              />
            </Col>
          </Row>

          {selectedModule && (
            <div style={{ marginBottom: 16, textAlign: "right" }}>
              <Button type="primary" onClick={handleSubmitGrades}>
                Lưu điểm
              </Button>
            </div>
          )}

          <Card
            className="table-card"
            style={{
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
              marginTop: 16,
              borderRadius: 8,
            }}
          >
            {!selectedClass ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <h3 className="text-center text-gray-500 text-lg">
                  <i className="fa-solid fa-circle-info mr-2">
                    Vui lòng chọn lớp học để xem danh sách sinh viên.
                  </i>
                </h3>
              </div>
            ) : (
              <>
                <Table
                  dataSource={gradeData}
                  columns={
                    !selectedModule
                      ? [
                          {
                            title: "Mã SV",
                            dataIndex: ["student", "studentId"],
                            key: "studentId",
                            fixed: "left",
                            width: 100,
                          },
                          {
                            title: "Họ tên",
                            dataIndex: ["student", "name"],
                            key: "name",
                            fixed: "left",
                            width: 200,
                          },
                        ]
                      : getGradeColumns()
                  }
                  scroll={{ x: "max-content" }}
                  pagination={false}
                  bordered
                  rowKey={(record) => record.student?.id || "fallback"}
                  style={{ borderRadius: 8 }}
                  loading={loading}
                />
              </>
            )}
          </Card>
        </>
      </Card>
    </div>
  );
};

export default GradesPage;
