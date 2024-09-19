import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import ClassItem from "./ClassItem";
import { studentService } from "../../services/student-service/student.service"; // Import StudentService

const ClassList = ({ classes, onSuccess }) => {
  const [studentCounts, setStudentCounts] = useState<{ [key: string]: number }>(
    {},
  );

  // Fetch total students for each class
  const fetchTotalStudents = async (classId: string) => {
    try {
      const total = await studentService.getTotalStudents(classId);
      return total;
    } catch (error) {
      console.error(
        `Error fetching total students for class ${classId}:`,
        error,
      );
      return 0;
    }
  };

  // useEffect(() => {
  //   const fetchAllStudents = async () => {
  //     // const updatedStudentCounts = {};
  //     // for (const classItem of classes) {
  //     //   const total = await fetchTotalStudents(classItem.id);
  //     //   updatedStudentCounts[classItem.id] = total;
  //     // }
  //     // setStudentCounts(updatedStudentCounts);
  //   };

  //   fetchAllStudents();
  // }, [classes]);

  return (
    <Row gutter={[16, 16]}>
      {classes.map((classItem, index) => (
        <Col
          key={index}
          xs={24} // Full width on extra-small screens
          sm={12} // Half width on small screens
          md={10} // One-third width on medium screens
          lg={8} // One-fourth width on large screens
          xl={6} // One-fifth width on extra-large screens
          xxl={5} // One-sixth width on extra-extra-large screens
        >
          <ClassItem
            onSucess={onSuccess}
            classId={classItem.id}
            name={classItem.name}
            position={
              classItem.classroom?.name && classItem.classroom?.building?.name
                ? `${classItem.classroom.name}-${classItem.classroom.building.name}`
                : "Unknown Location"
            }
            totalStudent={studentCounts[classItem.id] || 0} // Fetch total students dynamically
          />
        </Col>
      ))}
    </Row>
  );
};

export default ClassList;
