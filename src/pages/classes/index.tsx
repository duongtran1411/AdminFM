import { Col, Form, Row, Select } from "antd";
import { useEffect, useMemo, useState } from "react";
import ClassList from "../../components/class/ClassList";
import FloatButtonGroup from "../../components/class/FloatButtonGroup";
import Loading from "../../components/common/loading";
import { ClassStatus } from "../../models/class.status.model";
import { Class } from "../../models/classes.model";
import ClassService from "../../services/class-service/class.service";
import courseFamilyService from "../../services/course-family-service/course.family.service";
import { CoursesFamily } from "../../models/courses.model";

const { Option } = Select;

const ClassPage = () => {
  const [allClasses, setAllClasses] = useState<Class[]>([]);
  const [coursesFamilies, setCoursesFamilies] = useState<CoursesFamily[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    course_family_id?: number;
    status?: ClassStatus;
  }>({});

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const data = await ClassService.getClasses();
      setAllClasses(data.data);
    } catch (error) {
      setError("Error loading classes");
    } finally {
      setLoading(false);
    }
  };

  const fetchCoursesFamilies = async () => {
    try {
      const data = await courseFamilyService.getAll();
      setCoursesFamilies(data);
    } catch (error) {
      console.error("Error loading course families:", error);
      setError("Error loading course families");
    }
  };

  useEffect(() => {
    Promise.all([fetchClasses(), fetchCoursesFamilies()]).then(() =>
      setLoading(false),
    );
  }, []);

  const handleFilterChange = (_: any, allValues: any) => {
    setFilters({
      course_family_id: allValues.course_family_id,
      status: allValues.status,
    });
  };

  const filteredClasses = useMemo(() => {
    return allClasses.filter((classItem) => {
      const matchesCourseFamily =
        !filters.course_family_id ||
        filters.course_family_id == classItem.coursesFamilyId;

      const matchesStatus =
        !filters.status || classItem.status === filters.status;
      return matchesCourseFamily && matchesStatus;
    });
  }, [allClasses, filters]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div style={{ position: "relative" }}>
      <FloatButtonGroup onSuccess={fetchClasses} />
      <Row gutter={[16, 16]} style={{ marginTop: 50, marginBottom: 20 }}>
        <Col span={24}>
          <Form layout="inline" onValuesChange={handleFilterChange}>
            <Form.Item name="course_family_id" label="Course Family">
              <Select
                style={{ width: 200 }}
                allowClear
                placeholder="Select Course Family"
              >
                {coursesFamilies.map((family) => (
                  <Option
                    key={family.course_family_id}
                    value={family.course_family_id}
                  >
                    {family.course_family_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="status" label="Status">
              <Select
                style={{ width: 200 }}
                allowClear
                placeholder="Select Status"
              >
                {Object.values(ClassStatus).map((status) => (
                  <Option key={status} value={status}>
                    {status}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <ClassList classes={filteredClasses} onSuccess={fetchClasses} />
    </div>
  );
};

export default ClassPage;
