import { SaveOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Empty,
  Input,
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
import { GradeComponentStatus } from "../../models/enum/gradecomponent.enum";
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
          {
            length: Math.min(selectedClassData.semester?.term_number || 6, 6),
          },
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
      if (
        selectedModule &&
        selectedClass &&
        selectedTerm &&
        students.length > 0
      ) {
        try {
          // Fetch module data để lấy thông tin gradeComponents
          const moduleResponse = await moduleService.getModulesByClassAndTerm(
            selectedClass,
            selectedTerm,
          );
          const moduleData = moduleResponse.data.find(
            (m) => m.module_id === selectedModule,
          );

          // Tạo map của gradeComponents với weight và status
          const gradeComponentMap: { [key: number]: any } = {};
          moduleData?.gradeCategories?.forEach((category) => {
            category.gradeComponents?.forEach((component) => {
              if (component.id) {
                gradeComponentMap[component.id] = {
                  ...component,
                  weight: component.weight,
                  status: component.status,
                  gradeCategory: {
                    id: category.id,
                    name: category.name,
                    weight: category.weight,
                  },
                };
              }
            });
          });

          // Fetch grades cho từng student
          const gradePromises = students.map((student) =>
            gradeCategoryService.getGradeByModuleAndStudent(
              student.id,
              selectedModule,
            ),
          );
          const gradeResponses = await Promise.all(gradePromises);

          // Map lại dữ liệu để thêm thông tin weight và status
          const mappedGradeData = gradeResponses.map((response) => {
            const studentData = response.data;
            return {
              ...studentData,
              grades: studentData.grades.map((grade) => ({
                ...grade,
                gradeComponent: {
                  ...grade.gradeComponent,
                  ...(grade.gradeComponent.id &&
                    gradeComponentMap[grade.gradeComponent.id]),
                },
              })),
            };
          });

          console.log("Mapped Grade Data:", mappedGradeData);
          setGradeData(mappedGradeData);

          // Khởi tạo manualFinalGrades từ dữ liệu DB
          const initialFinalGrades: { [key: number]: number } = {};
          mappedGradeData.forEach((studentData) => {
            if (
              studentData?.student?.id &&
              studentData?.finalGrade?.average_grade
            ) {
              initialFinalGrades[studentData.student.id] = parseFloat(
                studentData.finalGrade.average_grade,
              );
            }
          });
          setManualFinalGrades(initialFinalGrades);
        } catch (error: any) {
          notification.error({ message: error.response.data.error });
        }
      }
    };
    fetchGrades();
  }, [selectedModule, students, selectedClass, selectedTerm]);

  const calculateFinalGrade = (studentData: any): number | null => {
    if (!studentData.grades || studentData.grades.length === 0) return null;

    let totalWeightedScore = 0;
    let totalWeight = 0;

    const categoryMap = new Map();

    studentData.grades.forEach((grade: any) => {
      const categoryId = grade.gradeComponent.gradeCategory.id;
      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, {
          active: [],
          mainExam: [],
          resit: [],
        });
      }

      const status = grade.gradeComponent.status;
      switch (status) {
        case GradeComponentStatus.REGULAR:
          categoryMap.get(categoryId).active.push(grade);
          break;
        case GradeComponentStatus.MAIN_EXAM:
          categoryMap.get(categoryId).mainExam.push(grade);
          break;
        case GradeComponentStatus.RESIT:
          categoryMap.get(categoryId).resit.push(grade);
          break;
      }
    });

    // Tính điểm tổng kết ban đầu với Active và Main Exam
    for (const [_, grades] of categoryMap.entries()) {
      const allGrades = [...grades.active, ...grades.mainExam];
      if (
        allGrades.some(
          (grade) => grade.score === null || grade.score === undefined,
        )
      ) {
        return null; // Chưa nhập đủ điểm
      }

      allGrades.forEach((grade) => {
        const weight = parseFloat(grade.gradeComponent.weight || "0") / 100;
        const score = parseFloat(grade.score);

        if (!isNaN(weight) && !isNaN(score)) {
          totalWeightedScore += score * weight;
          totalWeight += weight;
        }
      });
    }

    if (totalWeight === 0) return null;

    let initialFinalGrade =
      Math.round((totalWeightedScore / totalWeight) * 10) / 10;

    // Nếu NOT PASSED, tính lại với điểm Resit
    if (studentData.finalGrade?.status === "NOT PASSED") {
      totalWeightedScore = 0;
      totalWeight = 0;

      for (const [_, grades] of categoryMap.entries()) {
        grades.active.forEach((grade) => {
          const weight = parseFloat(grade.gradeComponent.weight || "0") / 100;
          const score = parseFloat(grade.score);

          if (!isNaN(weight) && !isNaN(score)) {
            totalWeightedScore += score * weight;
            totalWeight += weight;
          }
        });

        const resitGrade = grades.resit[0];
        if (resitGrade) {
          const weight =
            parseFloat(resitGrade.gradeComponent.weight || "0") / 100;
          const score = parseFloat(resitGrade.score);
          if (!isNaN(weight) && !isNaN(score)) {
            totalWeightedScore += score * weight;
            totalWeight += weight;
          }
        }
      }

      if (totalWeight === 0) return null;
      return Math.round((totalWeightedScore / totalWeight) * 10) / 10;
    }

    return initialFinalGrade;
  };

  const handleScoreChange = (
    studentId: number,
    gradeComponentId: number,
    newScore: number | null,
  ) => {
    setGradeData((prevData) =>
      prevData.map((studentData) => {
        if (studentData.student?.id === studentId) {
          const updatedGrades = studentData.grades.map((g: any) => {
            if (g.gradeComponent.id === gradeComponentId) {
              return {
                ...g,
                score: newScore,
              };
            }
            return g;
          });

          const updatedStudentData = {
            ...studentData,
            grades: updatedGrades,
          };

          // Tính lại điểm tổng kết ngay khi có thay đổi
          const calculatedFinalGrade = calculateFinalGrade(updatedStudentData);
          if (calculatedFinalGrade !== null) {
            setManualFinalGrades((prev) => ({
              ...prev,
              [studentId]: calculatedFinalGrade,
            }));
          }

          return updatedStudentData;
        }
        return studentData;
      }),
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
        // Xử lý từng điểm thành phần
        studentData.grades.forEach((grade) => {
          // Nếu có điểm gốc
          if (grade.score !== null && grade.score !== undefined) {
            gradesToSubmit.push({
              studentId: studentData.student.id,
              moduleId: selectedModule,
              gradeComponentId: grade.gradeComponent.id,
              score: grade.score,
              isResit: false,
            });
          }

          // Nếu có điểm thi lại và thành phần này cho phép thi lại
          if (
            grade.gradeComponent.isResit &&
            grade.resit_score !== null &&
            grade.resit_score !== undefined
          ) {
            gradesToSubmit.push({
              studentId: studentData.student.id,
              moduleId: selectedModule,
              gradeComponentId: grade.gradeComponent.id,
              score: grade.resit_score,
              isResit: true,
            });
          }
        });

        // Xử lý điểm tổng kết
        const finalGrade = manualFinalGrades[studentData.student.id];
        if (finalGrade !== undefined) {
          gradesToSubmit.push({
            studentId: studentData.student.id,
            moduleId: selectedModule,
            average_grade: finalGrade || undefined,
            remarks: remarks[studentData.student.id] ?? "",
            isResit: studentData.finalGrade?.attempt === 2 || false,
          });
        }
      });

      if (gradesToSubmit.length === 0) {
        notification.warning({ message: "Không có điểm nào để lưu" });
        return;
      }

      await gradeCategoryService.assignGradesForStudents(gradesToSubmit);
      notification.success({ message: "Lưu điểm thành công" });

      // Fetch lại module data để lấy thông tin weight và status
      const moduleResponse = await moduleService.getModulesByClassAndTerm(
        selectedClass || 0,
        selectedTerm || 0,
      );
      const moduleData = moduleResponse.data.find(
        (m) => m.module_id === selectedModule,
      );

      // Tạo map của gradeComponents với weight và status
      const gradeComponentMap: { [key: number]: any } = {};
      moduleData?.gradeCategories?.forEach((category) => {
        category.gradeComponents?.forEach((component) => {
          if (component.id) {
            gradeComponentMap[component.id] = {
              ...component,
              weight: component.weight,
              status: component.status,
              gradeCategory: {
                id: category.id,
                name: category.name,
                weight: category.weight,
              },
            };
          }
        });
      });

      // Fetch lại dữ liệu sau khi lưu thành công
      if (selectedModule && students.length > 0) {
        const gradePromises = students.map((student) =>
          gradeCategoryService.getGradeByModuleAndStudent(
            student.id,
            selectedModule,
          ),
        );
        const gradeResponses = await Promise.all(gradePromises);

        // Map lại dữ liệu để thêm thông tin weight và status
        const mappedGradeData = gradeResponses.map((response) => {
          const studentData = response.data;
          return {
            ...studentData,
            grades: studentData.grades.map((grade) => ({
              ...grade,
              gradeComponent: {
                ...grade.gradeComponent,
                ...(grade.gradeComponent.id &&
                  gradeComponentMap[grade.gradeComponent.id]),
              },
            })),
          };
        });

        setGradeData(mappedGradeData);

        // Cập nhật lại manualFinalGrades
        const initialFinalGrades = {};
        mappedGradeData.forEach((studentData) => {
          if (
            studentData?.student?.id &&
            studentData?.finalGrade?.average_grade
          ) {
            initialFinalGrades[studentData.student.id] = parseFloat(
              studentData.finalGrade.average_grade,
            );
          }
        });
        setManualFinalGrades(initialFinalGrades);
      }
    } catch (error) {
      notification.error({ message: "Lỗi khi lưu điểm" });
    } finally {
      setLoading(false);
    }
  };

  const isAllComponentGradesEntered = (studentData: any): boolean => {
    if (!studentData.grades || studentData.grades.length === 0) return false;

    // Chỉ kiểm tra các thành phần điểm không phải resit
    const normalGrades = studentData.grades.filter(
      (grade: any) => !grade.gradeComponent.isResit,
    );

    return normalGrades.every(
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
        width: 80,
        align: "center",
      },
      {
        title: "Họ tên",
        dataIndex: ["student", "name"],
        key: "name",
        fixed: "left",
        width: 80,
      },
    ];

    if (selectedModule && gradeData.length > 0 && gradeData[0].grades) {
      const uniqueComponents = new Map();
      gradeData[0].grades.forEach((grade) => {
        const componentId = grade.gradeComponent.id;
        if (!uniqueComponents.has(componentId)) {
          uniqueComponents.set(componentId, grade.gradeComponent);
        }
      });

      const gradeComponentColumns = Array.from(uniqueComponents.values()).map(
        (component: any) => {
          const weight = parseFloat(component.weight || "0");
          const formattedWeight = Number.isInteger(weight)
            ? `${weight}%`
            : `${weight.toFixed(1)}%`;

          return {
            title: (
              <div style={{ textAlign: "center" }}>
                <div>{component.name}</div>
                <div style={{ color: "#666", fontSize: "12px" }}>
                  ({formattedWeight})
                </div>
              </div>
            ),
            key: `grade-${component.id}`,
            width: 70,
            align: "center" as const,
            render: (_, record) => {
              const gradeItem = record.grades.find(
                (g: any) => g.gradeComponent.id === component.id,
              );

              if (component.status === GradeComponentStatus.RESIT) {
                return (
                  <InputNumber
                    value={gradeItem?.score ?? null}
                    onChange={(value) =>
                      handleScoreChange(record.student.id, component.id, value)
                    }
                    style={{ width: "90%" }}
                    min={0}
                    max={10}
                    step={0.1}
                    placeholder="Điểm thi lại"
                    size="middle"
                    className="grade-input"
                  />
                );
              }

              return (
                <InputNumber
                  value={gradeItem?.score || null}
                  onChange={(value) =>
                    handleScoreChange(record.student.id, component.id, value)
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
        },
      );

      columns.push(...gradeComponentColumns);

      columns.push(
        {
          title: "Điểm tổng kết",
          key: "finalGrade",
          width: 70,
          fixed: "right",
          align: "center",
          render: (_, record) => {
            const finalGrade = manualFinalGrades[record.student.id];
            const calculatedGrade = calculateFinalGrade(record);

            return (
              <InputNumber
                value={finalGrade ?? calculatedGrade}
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
            );
          },
        },

        {
          title: "Ghi chú",
          key: "remarks",
          width: 90,
          fixed: "right",
          align: "center",
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
        {
          title: "Trạng thái",
          key: "status",
          width: 40,
          fixed: "right",
          align: "center",
          render: (_, record) => {
            const status = record.finalGrade?.status;
            return (
              <span
                style={{
                  color: status === "PASSED" ? "#52c41a" : "#ff4d4f",
                  fontWeight: "bold",
                }}
              >
                {status}
              </span>
            );
          },
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
