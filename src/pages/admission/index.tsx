import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps, Modal, notification, Tooltip } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { AiOutlineMore } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import AddAdmissionProgramButton from "../../components/admission/AddAdmissionProgramButton";
import AddAdmissionProgramForm from "../../components/admission/AddAdmissionProgramForm";
import AdmissionProgramTable from "../../components/admission/AdmissionProgramTable";
import Loading from "../../components/common/loading";
import useModals from "../../hooks/useModal";
import { AdmissionProgram } from "../../models/admission.model";
import { Response } from "../../models/response.model";
import admissionService from "../../services/admission-program-service/admission.service";

const AdmissionPage = () => {
  const { isVisible, showModal, hideModal } = useModals();
  const [admissionProgramsResponse, setAdmissionProgramsResponse] =
    useState<Response<AdmissionProgram[]> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useState<Response<AdmissionProgram> | null>(null);
  const navigate = useNavigate();

  const fetchAdmissionPrograms = async () => {
    try {
      const response = await admissionService.getAll();
      console.log(response);
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

  const menu = (admissionProgram: AdmissionProgram): MenuProps => ({
    items: [
      {
        key: 'view',
        label: 'View Details',
        icon: <EyeOutlined />,
        onClick: () => handleView(admissionProgram.id),
      },
      {
        key: 'delete',
        label: (
          <span style={{ color: "red" }}>
            <DeleteOutlined style={{ color: "red" }} /> Delete
          </span>
        ),
        onClick: () => handleDelete(admissionProgram.id),
      },
    ],
  });
  

  const columns = [
    {
      title: "Tên",
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
      title: "Thời gian tuyển sinh",
      key: "period",
      render: (_: string, record: AdmissionProgram) => (
        <span>
          {moment(record.startDate).format("DD/MM/YYYY")} -{" "}
          {moment(record.endDate).format("DD/MM/YYYY")}
        </span>
      ),
    },
    {
      title: "Thời gian đăng ký",
      key: "registration",
      render: (_: string, record: AdmissionProgram) => (
        <span>
          {moment(record.startRegistration).format("DD/MM/YYYY")} -{" "}
          {moment(record.endRegistration).format("DD/MM/YYYY")}
        </span>
      ),
    },
    {
      title: "Số lượng tuyển sinh",
      dataIndex: "quota",
      key: "quota",
    },
    {
      title: "",
      key: "actions",
      render: (_, record: AdmissionProgram) => (
        <Dropdown menu={menu(record)} trigger={["click"]}>
          <Button
            type="text"
            icon={<AiOutlineMore style={{ fontSize: "20px" }} />}
          />
        </Dropdown>
      ),
    },
  ];

  const handleView = (id: number) => {
    navigate(`/admission/${id}`);
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "Are you sure you want to delete this Admission Program?",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await admissionService.delete(id);
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

  const onCreateSuccess = () => {
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
            open={isVisible("createAdmissionProgram")}
            hideModal={() => hideModal("createAdmissionProgram")}
            onAdmissionProgramCreated={onCreateSuccess}
          />

          <AdmissionProgramTable
            columns={columns}
            data={
              admissionProgramsResponse ? admissionProgramsResponse.data : []
            }
          />
        </div>
      </div>
    </>
  );
};

export default AdmissionPage;
