import { Col, Row } from "antd";
import { useState } from "react";
import ClassItem from "./ClassItem";

const ClassList = ({ classes, onSuccess }) => {
  const [studentCounts, setStudentCounts] = useState<{ [key: string]: number }>(
    {},
  );

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
            totalStudent={studentCounts[classItem.id] || 0} // Fetch total students dynamically
          />
        </Col>
      ))}
    </Row>
  );
};

export default ClassList;
