import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu, Modal, notification, Tooltip } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { AiOutlineMore } from "react-icons/ai";
import AddAdmissionProgramButton from "../../components/admission/AddAdmissionProgramButton";
import AddAdmissionProgramForm from "../../components/admission/AddAdmissionProgramForm";
import AdmissionProgramTable from "../../components/admission/AdmissionProgramTable";
import EditAdmissionProgramForm from "../../components/admission/EditAdmissionProgramForm";
import Loading from "../../components/common/loading";
import useModals from "../../hooks/useModal";
import { AdmissionProgram } from "../../models/admission.model";
import { Response } from "../../models/response.model";
import AdmissionService from "../../services/admission-service/admission.service";

const AdmissionPage = () => {
  const { isVisible, showModal, hideModal } = useModals();
  const [admissionProgramsResponse, setAdmissionProgramsResponse] =
    useState<Response<AdmissionProgram[]> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAdmissionProgram, setSelectedAdmissionProgram] =
    useState<AdmissionProgram | null>(null);

  const fetchAdmissionPrograms = async () => {
    try {
      const response = await AdmissionService.getAll();
      setAdmissionProgramsResponse(response);
    } catch (error) {
      setError("Error loading admission programs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissionPrograms();
  }, []);

  const menu = (admissionProgram: AdmissionProgram) => (
    <Menu>
      <Menu.Item
        key="edit"
        icon={<EditOutlined />}
        onClick={() => handleEdit(admissionProgram.id)}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        style={{ color: "red" }}
        key="delete"
        icon={<DeleteOutlined style={{ color: "red" }} />}
        onClick={() => handleDelete(admissionProgram.id)}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Period",
      key: "period",
      render: (_: string, record: AdmissionProgram) => (
        <span>
          {moment(record.startDate).format("DD/MM/YYYY")} -{" "}
          {moment(record.endDate).format("DD/MM/YYYY")}
        </span>
      ),
    },
    {
      title: "Registration",
      key: "registration",
      render: (_: string, record: AdmissionProgram) => (
        <span>
          {moment(record.startRegister).format("DD/MM/YYYY")} -{" "}
          {moment(record.endRegister).format("DD/MM/YYYY")}
        </span>
      ),
    },
    {
      title: "Quota",
      dataIndex: "quota",
      key: "quota",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: AdmissionProgram) => (
        <Dropdown overlay={menu(record)} trigger={["click"]}>
          <Button
            type="text"
            icon={<AiOutlineMore style={{ fontSize: "20px" }} />}
          />
        </Dropdown>
      ),
    },
  ];

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Admission Program?",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await AdmissionService.delete(id);
          if (admissionProgramsResponse) {
            const updatedAdmissionPrograms =
              admissionProgramsResponse.data.filter((p) => p.id !== id);
            setAdmissionProgramsResponse({
              ...admissionProgramsResponse,
              data: updatedAdmissionPrograms,
            });
          }
          notification.success({
            message: "Admission Program deleted successfully",
          });
        } catch (error) {
          notification.error({ message: "Error deleting Admission Program" });
        }
      },
    });
  };

  const handleEdit = (id: number) => {
    const admissionProgram = admissionProgramsResponse?.data.find(
      (p) => p.id === id,
    );
    if (admissionProgram) {
      setSelectedAdmissionProgram(admissionProgram);
      showModal("editAdmissionProgram");
    }
  };

  const onCreateSuccess = () => {
    fetchAdmissionPrograms();
  };

  const onUpdateSuccess = () => {
    fetchAdmissionPrograms();
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
          <AddAdmissionProgramButton
            onAdmissionProgramCreated={() =>
              showModal("createAdmissionProgram")
            }
          />

          <AddAdmissionProgramForm
            visible={isVisible("createAdmissionProgram")}
            hideModal={() => hideModal("createAdmissionProgram")}
            onAdmissionProgramCreated={onCreateSuccess}
          />

          <AdmissionProgramTable
            columns={columns}
            data={
              admissionProgramsResponse ? admissionProgramsResponse.data : []
            }
          />

          <EditAdmissionProgramForm
            isModalVisible={isVisible("editAdmissionProgram")}
            hideModal={() => hideModal("editAdmissionProgram")}
            admissionProgram={selectedAdmissionProgram}
            onUpdate={onUpdateSuccess}
          />
        </div>
      </div>
    </>
  );
};

export default AdmissionPage;
