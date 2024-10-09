import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Dropdown, Input, Menu, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { AiOutlineMore } from "react-icons/ai";
import useModals from "../../hooks/useModal";
import { CoursesFamily } from "../../models/courses.model";
import courseFamilyService from "../../services/course-family-service/course.family.service";
import AddCourseFamilyButton from "../../components/course/AddCourseFamilyButton";
import AddCourseFamilyForm from "../../components/course/AddCourseFamilyForm";
import CoursesFamilyTable from "../../components/course/CoursesFamilyTable";
import EditCourseFamilyForm from "../../components/course/EditCourseFamilyForm";
import Loading from "../../components/common/loading";

const CoursePage = () => {
  const { isVisible, showModal, hideModal } = useModals();
  const [coursesFamily, setCoursesFamily] = useState<CoursesFamily[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCourseFamily, setSelectedCourseFamily] =
    useState<CoursesFamily | null>(null);

  const fetchCoursesFamily = async () => {
    try {
      const data = await courseFamilyService.getAll();
      setCoursesFamily(data);
    } catch (error) {
      setError("Error loading courses family");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCoursesFamily();
  }, []);

  const menu = (course: CoursesFamily) => (
    <Menu>
      <Menu.Item
        key="edit"
        icon={<EditOutlined />}
        onClick={() => handleEdit(course.course_family_id)}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        style={{ color: "red" }}
        key="delete"
        icon={<DeleteOutlined style={{ color: "red" }} />}
        onClick={() => handleDelete(course.course_family_id)}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "course_family_id",
      key: "course_family_id",
    },
    {
      title: "Name",
      dataIndex: "course_family_name",
      key: "course_family_name",
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
    },
    {
      title: "Courses",
      key: "courses",
      render: (_, record: CoursesFamily) => {
        return record.courses.map((course) => course.course_name).join(",  ");
      },
    },
    {
      title: "",
      key: "actions",
      render: (_, record: CoursesFamily) => (
        <Dropdown overlay={() => menu(record)} trigger={["click"]}>
          <Button
            type="text"
            icon={<AiOutlineMore style={{ fontSize: "20px" }} />}
            style={{ float: "right" }}
          />
        </Dropdown>
      ),
    },
  ];

  const handleDelete = async (cid: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Course Family?",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await courseFamilyService.delete(cid);
          setCoursesFamily(
            coursesFamily.filter((c) => c.course_family_id !== cid),
          );
          notification.success({
            message: "Course Family deleted successfully",
          });
        } catch (error) {
          notification.error({ message: "Error deleting Course Family" });
        }
      },
    });
  };

  const handleEdit = (id: number) => {
    const cfml = coursesFamily.find((c) => c.course_family_id === id);
    if (cfml) {
      setSelectedCourseFamily(cfml);
      showModal("editCourseFamily");
    }
  };

  const onCreateSuccess = () => {
    fetchCoursesFamily();
  };

  const onUpdateSuccess = () => {
    fetchCoursesFamily();
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
            <AddCourseFamilyButton
              onCourseCreated={() => showModal("createCourseFamily")}
            />
          </div>
          <Input.Search
            placeholder="Tìm kiếm tên Course Family..."
            allowClear
            // onSearch={handleSearch}
            style={{ width: 400, marginBottom: 16 }}
          />

          {/* Create Course modal */}
          <AddCourseFamilyForm
            isModalVisible={isVisible("createCourseFamily")}
            hideModal={() => hideModal("createCourseFamily")}
            onCourseCreated={onCreateSuccess}
          />

          {/* Course Data Table */}
          <CoursesFamilyTable columns={columns} data={coursesFamily} />

          {/* Edit Course modal */}
          <EditCourseFamilyForm
            isModalVisible={isVisible("editCourseFamily")}
            hideModal={() => hideModal("editCourseFamily")}
            coursefamily={selectedCourseFamily}
            onUpdate={onUpdateSuccess}
          />
        </div>
      </div>
    </>
  );
};

export default CoursePage;
