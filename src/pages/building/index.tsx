import { Button, Dropdown, Menu, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import AddBuildingButton from "../../components/building/AddBuildingButton";
import AddBuildingForm from "../../components/building/AddBuildingForm";
import BuildingTable from "../../components/building/BuildingTable";
import EditBuildingForm from "../../components/building/EditBuildingForm";
import TabsMenu from "../../components/student/TabsMenu";
import useModals from "../../hooks/useModal";
import { Building } from "../../models/building.model";
import buildingService from "../../services/building-service/building.service";
import { AiOutlineMore } from "react-icons/ai";

const BuildingPage = () => {
  const { isVisible, showModal, hideModal } = useModals();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null,
  );
  const fetchBuilding = async () => {
    try {
      const data = await buildingService.getAllBuilding();
      setBuildings(data);
    } catch (error) {
      setError("Error loading building");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBuilding();
  }, []);

  const menu = (build: Building) => (
    <Menu>
      <Menu.Item key="edit" onClick={() => handleEdit(build.id)}>
        Edit
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => handleDelete(build.id)}>
        Delete
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "",
      key: "actions",
      render: (_, record) => (
        <Dropdown overlay={menu(record)} trigger={["click"]}>
          <Button
            type="text"
            icon={<AiOutlineMore style={{ fontSize: "20px" }} />} // Thay đổi kích thước icon ở đây
            style={{ float: "right" }}
          />
        </Dropdown>
      ),
    },
  ];

  const handleDelete = async (bid: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this building?",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await buildingService.deleteBuilding(bid);
          setBuildings(buildings.filter((build) => build.id !== bid));
          notification.success({ message: "Building deleted successfully" });
        } catch (error) {
          notification.error({ message: "Error deleting building" });
        }
      },
    });
  };

  const handleEdit = (id: number) => {
    const build = buildings.find((s) => s.id === id);
    if (build) {
      setSelectedBuilding(build);
      showModal("editBuilding");
    }
  };

  const onCreateSuccess = () => {
    fetchBuilding();
  };

  const onUpdateSuccess = () => {
    fetchBuilding();
  };

  if (loading) {
    return <p>Loading building...</p>;
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
          <AddBuildingButton
            onNewBuildingClick={() => showModal("createBuilding")}
          />
        </div>
        <AddBuildingForm
          isModalVisible={isVisible("createBuilding")}
          hideModal={() => hideModal("createBuilding")}
          onBuildingCreated={onCreateSuccess}
        />
        <BuildingTable data={buildings} columns={columns} />
      </div>
      <EditBuildingForm
        isModalVisible={isVisible("editBuilding")}
        hideModal={() => hideModal("editBuilding")}
        building={selectedBuilding}
        onUpdate={onUpdateSuccess}
      />
    </div>
  );
};

export default BuildingPage;
