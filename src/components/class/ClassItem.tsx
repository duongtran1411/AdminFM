// components/class/ClassItem.tsx
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Card, Dropdown, MenuProps } from "antd";
import { CiMenuKebab } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EditClassForm from "./EditClassForm";
import useModals from "../../hooks/useModal"; // Adjust the path as needed

interface ClassItemProps {
  title: string;
  position: string;
  totalStudent: number;
  classId: string;
}

const ClassItem = ({
  title,
  position,
  totalStudent,
  classId,
}: ClassItemProps) => {
  // Colors array for random background
  const colors = ["#FF4D4F", "#FFEC3D", "#52C41A"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const navigate = useNavigate();
  const { showModal, hideModal, isVisible } = useModals(); // Using useModals hook
  const [editingClass, setEditingClass] = useState<ClassItemProps>();

  const handleClick = () => {
    navigate(`/schedule/class/${classId}`);
  };

  // Edit action
  const handleEdit = () => {
    setEditingClass({ title, position, totalStudent, classId });
    showModal("editClassModal");
  };

  // Delete action
  const handleDelete = () => {
    console.log(`Delete class ${classId}`);
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
        {/* Three dots (kebab menu) in the top-right corner */}
        <div
          onClick={(e) => e.stopPropagation()} // Prevent click event from propagating to the card
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
            title={title}
            description={position}
            style={{ marginBottom: "16px" }}
          />
          <div style={{ marginTop: "8px" }}>
            <p
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#555",
                marginBottom: 5,
              }}
            >
              Total Student
            </p>
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

      {/* Edit modal */}
      {editingClass && (
        <EditClassForm
          visible={isVisible("editClassModal")}
          initialValues={editingClass}
          onEdit={() => {
            // Add your logic for handling edit
            hideModal("editClassModal");
          }}
          onCancel={() => hideModal("editClassModal")}
        />
      )}
    </>
  );
};

export default ClassItem;
