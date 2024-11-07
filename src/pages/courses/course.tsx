import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { AiOutlineMore } from "react-icons/ai";
import Loading from "../../components/common/loading";
import AddCourseButton from "../../components/course/AddCourseButton";
import AddCourseForm from "../../components/course/AddCourseForm";
import CoursesTable from "../../components/course/CourseTable";
import EditCourseForm from "../../components/course/EditCourseForm";
import useModals from "../../hooks/useModal";
import { Courses } from "../../models/courses.model";
import { courseService } from "../../services/courses-service/courses.service";

const CoursePage = () => {
  const { isVisible, showModal, hideModal } = useModals();
  const [courses, setCourses] = useState<Courses[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Courses | null>(null);

  const fetchCourses = async () => {
    try {
      const data = await courseService.getAllCourses();
      setCourses(data);
    } catch (error) {
      setError("Error loading courses");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCourses();
  }, []);

  const menu = (course: Courses) => (
    <Menu>
      <Menu.Item
        key="edit"
        icon={<EditOutlined />}
        onClick={() => handleEdit(course.course_id)}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        style={{ color: "red" }}
        key="delete"
        icon={<DeleteOutlined style={{ color: "red" }} />}
        onClick={() => handleDelete(course.course_id)}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "course_id",
      key: "course_id",
    },
    {
      title: "Course Name",
      dataIndex: "course_name",
      key: "course_name",
    },
    {
      title: "Course Code",
      dataIndex: "course_code",
      key: "course_code",
    },
    {
      title: "Module Name",
      key: "module_name",
      render: (record: Courses) => {
        return record.modules.map((module) => module.code).join(", ");
      },
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => (
        <Dropdown overlay={menu(record)} trigger={["click"]}>
          <Button
            type="text"
            icon={<AiOutlineMore style={{ fontSize: "20px" }} />}
            style={{ float: "right" }}
          />
        </Dropdown>
      ),
    },
    // Thêm các column nếu cần
  ];

  const handleDelete = async (cid: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Course?",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await courseService.deleteCourse(cid);
          setCourses(courses.filter((c) => c.course_id !== cid));
          notification.success({ message: "Course deleted successfully" });
        } catch (error) {
          notification.error({ message: "Error deleting Course" });
        }
      },
    });
  };

  const handleEdit = (id: number) => {
    const course = courses.find((c) => c.course_id === id);
    if (course) {
      setSelectedCourse(course);
      showModal("editCourse");
    }
  };

  const onCreateSuccess = () => {
    fetchCourses();
  };

  const onUpdateSuccess = () => {
    fetchCourses();
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "16px",
            }}
          >
            {/* Button Add Course */}
            <AddCourseButton
              onCourseCreated={() => showModal("createCourse")}
            />
          </div>

          {/* Create Course modal */}
          <AddCourseForm
            isModalVisible={isVisible("createCourse")}
            hideModal={() => hideModal("createCourse")}
            onCourseCreated={onCreateSuccess}
          />

          {/* Course Data Table */}
          <CoursesTable columns={columns} data={courses} />

          {/* Edit Course modal */}
          <EditCourseForm
            isModalVisible={isVisible("editCourse")}
            hideModal={() => hideModal("editCourse")}
            course={selectedCourse}
            onUpdate={onUpdateSuccess}
          />
        </div>
      </div>
    </>
  );
};

export default CoursePage;
