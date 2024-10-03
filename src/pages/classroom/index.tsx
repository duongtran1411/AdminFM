import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { AiOutlineMore } from "react-icons/ai";
import AddClassroomButton from "../../components/classroom/AddClassroomButton";
import AddClassroomForm from "../../components/classroom/AddClassroomForm";
import ClassroomTable from "../../components/classroom/ClassroomTable";
import TabsMenu from "../../components/student/TabsMenu";
import useModals from "../../hooks/useModal";
import { Classroom } from "../../models/classes.model";
import classRoomService from "../../services/class-room-service/class.room.service";
import { useParams } from "react-router-dom";
import EditClassroomForm from "../../components/classroom/EditBuildingForm";

const ClassroomPage = () => {
  const { isVisible, showModal, hideModal } = useModals();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const { buildingId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(
    null,
  );

  const fetchClassroom = async () => {
    try {
      const data = await classRoomService.getClassroomsByBId(+buildingId!);
      // console.log(data);
      setClassrooms(data);
    } catch (error) {
      setError("Error loading Classroom");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchClassroom();
  }, []);

  const menu = (clr: Classroom) => (
    <Menu>
      <Menu.Item
        key="edit"
        icon={<EditOutlined />}
        onClick={() => handleEdit(clr.id)}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        key="delete"
        style={{ color: "red" }}
        icon={<DeleteOutlined style={{ color: "red" }} />}
        onClick={() => handleDelete(clr.id)}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "Classroom Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Building Name",
      dataIndex: "building",
      key: "building",
      render: (building) => building.name,
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
  ];

  const handleDelete = async (clrid: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Classroom?",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await classRoomService.delete(clrid);
          setClassrooms(classrooms.filter((clr) => clr.id !== clrid));
          notification.success({ message: "Classroom deleted successfully" });
        } catch (error) {
          notification.error({ message: "Error deleting Classroom" });
        }
      },
    });
  };

  const handleEdit = (id: number) => {
    const classroom = classrooms.find((s) => s.id === id);
    if (classroom) {
      setSelectedClassroom(classroom);
      showModal("editClassroom");
    }
  };

  const onCreateSuccess = () => {
    fetchClassroom();
  };

  const onUpdateSuccess = () => {
    fetchClassroom();
  };

  if (loading) {
    return <p>Loading Classroom...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div style={{ width: "50%", maxWidth: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "16px",
          }}
        >
          <TabsMenu tabItems={[]} />
          <AddClassroomButton
            onNewClassroomClick={() => showModal("createClassroom")}
          />
        </div>
        <AddClassroomForm
          isModalVisible={isVisible("createClassroom")}
          hideModal={() => hideModal("createClassroom")}
          onClassroomCreated={onCreateSuccess}
          buildingId={+buildingId!}
        />
        <ClassroomTable data={classrooms} columns={columns} />
      </div>
      <EditClassroomForm
        isModalVisible={isVisible("editClassroom")}
        hideModal={() => hideModal("editClassroom")}
        classroom={selectedClassroom}
        onUpdate={onUpdateSuccess}
      />
    </div>
  );
};

export default ClassroomPage;
