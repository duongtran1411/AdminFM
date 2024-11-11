// components/class/ClassItem.tsx
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Card, Dropdown, MenuProps, message } from "antd";
import { useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import useModals from "../../hooks/useModal"; // Adjust the path as needed
import {
  default as ClassService,
  default as classService,
} from "../../services/class-service/class.service"; // Import ClassService
import EditClassForm from "./EditClassForm";

interface ClassItemProps {
  name: string;
  totalStudent: number;
  coursesFamilyId: number;
  classId: number;
  onSucess: () => void;
}

const ClassItem = ({
  name,
  totalStudent,
  classId,
  onSucess,
}: ClassItemProps) => {
  const colors = ["#FF4D4F", "#FFEC3D", "#52C41A"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const navigate = useNavigate();
  const { showModal, hideModal, isVisible } = useModals();
  const [editingClass, setEditingClass] = useState<any>();

  const handleClick = () => {
    navigate(`/schedule/class/${classId}`);
  };

  const handleEdit = async () => {
    const classEdit = await classService.getClassById(classId);
    if (classEdit) {
      const data = classEdit.data;
      setEditingClass({
        name: data.name,
        course_family_name: data.coursesFamily.course_family_name,
        term_number: data.term_number,
        status: data.status,
      });
      showModal("editClassModal");
    }
  };

  const handleDelete = async () => {
    try {
      await ClassService.deleteClass(classId);
      message.success("Xóa lớp học thành công");
      onSucess();
    } catch (error) {
      message.error("Failed to delete class");
    }
  };

  // Dropdown menu items
  const items: MenuProps["items"] = [
    {
      key: "edit",
      label: "Edit",
      icon: <EditOutlined />,
      onClick: handleEdit,
    },
    {
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined />,
      onClick: handleDelete,
      danger: true,
    },
  ];

  const handleSaveEdit = async (updatedClass: any) => {
    try {
      await ClassService.updateClass(classId, updatedClass);
      message.success("Class updated successfully");
      onSucess();
      hideModal("editClassModal");
    } catch (error) {
      message.error("Failed to update class");
    }
  };

  return (
    <>
      <Card
        style={{
          width: 240,
          margin: "16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          cursor: "pointer",
          position: "relative",
        }}
        onClick={handleClick}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
          }}
        >
          <Dropdown menu={{ items }} trigger={["click"]}>
            <div className="hover:bg-gray-200 rounded-full p-1 transition-colors duration-200">
              <CiMenuKebab size={20} />
            </div>
          </Dropdown>
        </div>
        <div>
          <Card.Meta
            title={name}
            description={"Total Student"}
            style={{ marginBottom: "16px" }}
          />
          <div style={{ marginTop: "8px" }}>
            <p
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                margin: "4px 0",
                color: "#000",
              }}
            >
              {totalStudent}
            </p>
          </div>
          <div
            style={{
              backgroundColor: randomColor,
              height: "4px",
              width: "100%",
            }}
          />
        </div>
      </Card>

      {editingClass && (
        <EditClassForm
          visible={isVisible("editClassModal")}
          initialValues={editingClass}
          onEdit={handleSaveEdit}
          onCancel={() => hideModal("editClassModal")}
        />
      )}
    </>
  );
};

export default ClassItem;
