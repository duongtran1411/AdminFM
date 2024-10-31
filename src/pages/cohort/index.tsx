import { Button, Dropdown, Menu, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { AiOutlineMore } from "react-icons/ai";
import AddCohortButton from "../../components/cohort/AddCohortButton";
import AddCohortForm from "../../components/cohort/AddCohortForm";
import CohortTable from "../../components/cohort/CohortTable";
import Loading from "../../components/common/loading";
import TabsMenu from "../../components/student-in-class/TabsMenu";
import useModals from "../../hooks/useModal";
import { Cohort } from "../../models/cohort.model";
import cohortService from "../../services/cohort-service/cohort.service";
import EditCohortForm from "../../components/cohort/EditCohortForm";

const CohortPage = () => {
  const { isVisible, showModal, hideModal } = useModals();
  const [cohort, setCohort] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null);
  const fetchCohort = async () => {
    try {
      const data = await cohortService.getAllCohort();
      setCohort(data.data);
    } catch (error) {
      setError("Error loading cohort");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCohort();
  }, []);

  const menu = (cohort: Cohort) => (
    <Menu>
      <Menu.Item key="edit" onClick={() => handleEdit(cohort.id)}>
        Edit
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => handleDelete(cohort.id)}>
        Delete
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "Tên niên khóa",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
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

  const handleDelete = async (bid: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Cohort?",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await cohortService.deleteCohort(bid);
          setCohort(cohort.filter((co) => co.id !== bid));
          notification.success({ message: "Cohort deleted successfully" });
        } catch (error) {
          notification.error({ message: "Error deleting cohort" });
        }
      },
    });
  };

  const handleEdit = (id: number) => {
    const c = cohort.find((s) => s.id === id);
    if (c) {
      setSelectedCohort(c);
      showModal("editCohort");
    }
  };

  const onCreateSuccess = () => {
    fetchCohort();
  };

  const onUpdateSuccess = () => {
    fetchCohort();
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error}</p>;
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
          <AddCohortButton
            onNewBuildingClick={() => showModal("createCohort")}
          />
        </div>
        <AddCohortForm
          isModalVisible={isVisible("createCohort")}
          hideModal={() => hideModal("createCohort")}
          onCohortCreated={onCreateSuccess}
        />
        <CohortTable data={cohort} columns={columns} />
      </div>
      <EditCohortForm
        isModalVisible={isVisible("editCohort")}
        hideModal={() => hideModal("editCohort")}
        cohort={selectedCohort}
        onUpdate={onUpdateSuccess}
      />
    </div>
  );
};

export default CohortPage;
